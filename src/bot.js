import client from "./client";
import resolve from "./commandResolver";
client.connect();
import quizServer from "./quizServer";
import Quiz from './quiz.js'
import queueServer from "./queue/queueServer.js"
import { messageToUser } from "./utils";

// Quiz Variables
const quizPayout = 1000;
const MILLISECONDS_TO_MINUTES = 60*1000
var quizDelay = 30
var quizInQueue = 0

var lastQuizTimestamp = Date.now()

var greetedList = []
var quizServerStatus = quizServer.getStatus()

quizServer.mountServer()

// Queue Variables

var playerQueue = []
var queueServerStatus = "open"

queueServer.mountServer()

// Commands
client.on("chat", (channel, user, message, self) => {
	if (self) return; // bot message

	var isOwnerCommand = ("#" + user.username == channel)

	//Quiz checks
	// check if there is a queued quiz
	quizServerStatus = quizServer.getStatus()
	if(lastQuizTimestamp + quizDelay*MILLISECONDS_TO_MINUTES < Date.now()) {
		if(quizInQueue > 0 && quizServerStatus != "inProgress") {
				console.log("	 New random quiz due to timer")
				quizServer.setRandomQuiz();
				quizInQueue--
				lastQuizTimestamp = Date.now()
		}
	}

	//Queue checks
	queueServerStatus = queueServer.getStatus()

	// if message has symbol whats mean command - !
	if (message.indexOf("!") !== -1)
	{
		var parsedCommand = resolve(channel, user, message);
		if(isOwnerCommand) // Restricted to channel owner commands, this could be expanded to moderators in the future
		{
			switch(parsedCommand.command)
			{
				// Quiz commands
				case "qstart":
						lastQuizTimestamp = Date.now()
						switch(parsedCommand.args.length)
						{
							case 0:
								quizInQueue = 0
							case 1:
								quizInQueue = parseInt(parsedCommand.args[0])
								break
							case 2:
								quizInQueue = parseInt(parsedCommand.args[0])
								quizDelay = parseInt(parsedCommand.args[1])
								break
							default:
								break
						}
						quizServer.setRandomQuiz()
					break;

				case "e":
					quizServerStatus = "hidden"
					quizDelay = 900
					quizInQueue = 0
					quizServer.eraseScreen()
					break

				default:
					break

				// Join queue commands
				case "fopen":
					console.log("Queue opened")
					queueServer.openQueue()
					break

				case "fremove":
					var elements = 0
					switch(parsedCommand.args.length)
					{
						case 1:
							elements = parseInt(parsedCommand.args[0])
							break
						default:
							break
					}
					queueServer.cullPlayerList(elements)
					console.log(`Remove the top ${elements} players from the list`)
					break

				case "fclose":
					queueServer.closeQueue()
					sendChatMessage("Queue closed")
					break
			}
		}
		// Regular user commands
		switch(parsedCommand.command)
		{
			case "fila":// Alias for join command
			case "join":
				switch(parsedCommand.args.length)
				{
					case 1:
						var res = queueServer.addToQueue(user.username, parsedCommand.args[0].slice(0, 15).replace(["<",">","/"], 0))
						if(res > 0)
						{
							sendTargetChatMessage(user, `added to queue`)
						}
						break
					default:
						console.log("Wrong parameters")
						// Warn user to provide correct dota Id
						break
				}
				break;
		}
	}
	else if(quizServerStatus == 'inProgress')
	{
		if(quizServer.checkAnswer(message, user.username))
		{
			var message = `acertou o quiz PogChamp e ganhou ${quizPayout} pelos!`;
			sendTargetChatMessage(user, message);
			message = `!givepoints ${user.username} ${quizPayout}`;
			sendChatMessage(message);
			setTimeout(function(){
				 quizServerStatus = "hidden"
				 quizServer.eraseScreen();
			}, 10000);

		}
	}
});

function sendTargetChatMessage(user, message)
{
	client.action(client.activeChannel, `@${user.username} ${message}`);
}

function sendChatMessage(message)
{
	client.action(client.activeChannel, `${message}`);
}

function greetUser(username)
{
	if(!greetedList.includes(username))
	{
		//TODO insert call to sound api
		if(res == 'done')
			greetedList.push(username)
	}
}

