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
const ID_LIMIT = 40

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
		var isUserFounder = user.hasOwnProperty('founder')
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
					console.log(`Removed the top ${elements} players from the list`)
					break

				case "fskip":
					switch(parsedCommand.args.length)
					{
						case 1:
							var index = parseInt(parsedCommand.args[0])
							queueServer.removePlayer(index - 1)
							console.log(`Removed player at position ${index}`)
							break
						default:
							console.log("Wrong parameters")
							break
					}
					break

				case "fclose":
					queueServer.closeQueue()
					sendChatMessage("Queue closed")
					break

				default:
					break
			}
		}
		// Regular user commands
		switch(parsedCommand.command)
		{
			case "fila":// Alias for join command
			case "join":
				var treatedId = parseIdPayload(parsedCommand)
				switch(parsedCommand.args.length)
				{
					case 1:
						var res = queueServer.addToQueue(user.username, treatedId, user.subscriber||isUserFounder)
						if(res > 0)
						{
							sendTargetChatMessage(user.username, `added to queue`)
						}
						break
					default:
						//For now, ignore command with multiple parameters
						break
				}
				break;

			case "pos":
				var pos = queueServer.getPosByName(user.username)
				if (pos >= 0)
				{
					sendTargetChatMessage(user.username, ` Your position at queue is #${pos+1}`)
				}
				else
				{
					sendTargetChatMessage(user.username, `You are not in queue!`)
				}
				break

			case "sair": //alias for exit command
			case "exit":
				var pos = queueServer.getPosByName(user.username)
				if (pos >= 0)
				{
					var res = queueServer.removePlayer(pos)
					if (res)
					{
						sendTargetChatMessage(user.username, `Successfully exited queue`)
					}
				}

				break
		}
	}
	else if(quizServerStatus == 'inProgress') // Quiz answer check logic
	{
		if(quizServer.checkAnswer(message, user.username))
		{
			var message = `acertou o quiz PogChamp e ganhou ${quizPayout} pelos!`;
			sendTargetChatMessage(user.username, message);
			message = `!givepoints ${user.username} ${quizPayout}`;
			sendChatMessage(message);
			setTimeout(function(){
				 quizServerStatus = "hidden"
				 quizServer.eraseScreen();
			}, 10000);

		}
	}
});

function parseIdPayload(parsedCommand)
{
	return parsedCommand.args.join(" ").slice(0, ID_LIMIT).replace(["<",">","/","\\"], "")
}

function sendTargetChatMessage(username, message)
{
	client.action(client.activeChannel, `@${username} ${message}`);
}

function sendPrivateMessage(username, message)
{
	client.whisper(username, message)//Currently not working on a non verified bot account
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

