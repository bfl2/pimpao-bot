import client from "./client";
import resolve from "./commandResolver";
client.connect();
import quizServer from "./quizServer";
import Quiz from './quiz.js'
import { messageToUser } from "./utils";

const quizPayout = 1000;
quizServer.mountServer()
var quizServerStatus = quizServer.getStatus();
// Commands
client.on("chat", (channel, user, message, self) => {
  if (self) return; // bot message
  quizServerStatus = quizServer.getStatus();

  var isOwnerCommand = ("#" + user.username == channel);

  // if message has symbol whats mean command - !
  if (message.indexOf("!") !== -1) {
    var parsedCommand = resolve(channel, user, message);
    //console.log("Channel:"+channel +" | isOwnerCommand "+isOwnerCommand + " | user:"+ user.username)
    switch(parsedCommand.command)
    {
      case "qstart":
        if(isOwnerCommand)
        {
          var qq = new Quiz(parsedCommand.command, parsedCommand.args.join(' '), "text");
          quizServer.setQuiz(qq);
        }
        break;

      case "e":
        quizServer.eraseScreen();
        break;

      default:
        break;
    }
  }
  else if(quizServerStatus == 'inProgress') {
    console.log("")
    if(quizServer.checkAnswer(message, user.username)) {
      var message = `acertou o quiz PogChamp e ganhou ${quizPayout} pelos!`;
      sendTargetChatMessage(user, message);
      message = `!givepoints ${user.username} ${quizPayout}`;
      sendChatMessage(message);
    }
  }
});

function sendTargetChatMessage(user, message) {
  client.action(client.activeChannel, `@${user.username} ${message}`);
}

function sendChatMessage(message) {
  client.action(client.activeChannel, `${message}`);
}

