import client from "./client";
import resolve from "./commandResolver";
client.connect();
import quizServer from "./quizServer";
import Quiz from './quiz.js'
import { messageToUser } from "./utils";

const quizPayout = 1000;
const MILLISECONDS_TO_MINUTES = 60*1000
var quizDelay = 30
var quizInQueue = 0

var lastQuizTimestamp = Date.now()

var greetedList = []
var quizServerStatus = quizServer.getStatus();

quizServer.mountServer()
// Commands
client.on("chat", (channel, user, message, self) => {
  if (self) return; // bot message
  quizServerStatus = quizServer.getStatus();

  var isOwnerCommand = ("#" + user.username == channel);

  // try to greet user
  // var res = greetUser(user.username)

  // check if there is a queued quiz
  if(lastQuizTimestamp + quizDelay*MILLISECONDS_TO_MINUTES < Date.now()) {
    if(quizInQueue > 0 && quizServerStatus != "inProgress") {
        console.log("   New random quiz due to timer")
        quizServer.setRandomQuiz();
        quizInQueue--
        lastQuizTimestamp = Date.now()
    }
  }

  // if message has symbol whats mean command - !
  if (message.indexOf("!") !== -1) {
    var parsedCommand = resolve(channel, user, message);
    switch(parsedCommand.command)
    {

      case "qstart":
        if(isOwnerCommand)
        {
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
          quizServer.setRandomQuiz();
        }
        break;

      case "e":
        quizServerStatus = "hidden"
        quizDelay = 900
        quizInQueue = 0
        quizServer.eraseScreen();
        break;

      default:
        break;
    }
  }
  else if(quizServerStatus == 'inProgress') {
    if(quizServer.checkAnswer(message, user.username)) {
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

function sendTargetChatMessage(user, message) {
  client.action(client.activeChannel, `@${user.username} ${message}`);
}

function sendChatMessage(message) {
  client.action(client.activeChannel, `${message}`);
}

function greetUser(username) {
  if(!greetedList.includes(username)) {
    //TODO insert call to sound api
    if(res == 'done')
      greetedList.push(username)
  }
}

