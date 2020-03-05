import client from "./client";
import resolve from "./commandResolver";
client.connect();
import quizServer from "./quizServer";
import Quiz from './quiz.js'
import { messageToUser } from "./utils";
import soundController from "./soundController";

const quizPayout = 1000;
quizServer.mountServer()
var quizServerStatus = quizServer.getStatus();
var greetedList = []
// Commands
client.on("chat", (channel, user, message, self) => {
  if (self) return; // bot message
  quizServerStatus = quizServer.getStatus();

  var isOwnerCommand = ("#" + user.username == channel);

  var res = greetUser(user.username)

  // if message has symbol whats mean command - !
  if (message.indexOf("!") !== -1) {
    var parsedCommand = resolve(channel, user, message);
    switch(parsedCommand.command)
    {
      case "qstart":
        if(isOwnerCommand)
        {
          console.log("//Starting Quiz")
          quizServer.setRandomQuiz();
        }
        break;

      case "e":
        quizServerStatus = "hidden"
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
      }, 5000);

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
    var res = soundController.playUserGreeting(username)
    if(res == 'done')
      greetedList.push(username)
  }
}

