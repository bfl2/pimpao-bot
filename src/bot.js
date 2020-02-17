import client from "./client";
import { resolve } from "./commandResolver";
client.connect();
import quizServer from "./quizServer";
import Quiz from './quiz.js'

quizServer.mountServer()

// Commands
client.on("chat", (channel, user, message, self) => {
  if (self) return; // bot message

  var qq = new Quiz("Qual a cor do céu?", "azul", "text")
  quizServer.setQuiz(qq)

  // if message has symbol whats mean command - !
  if (message.indexOf("!") !== -1) {
    resolve(channel, user, message);
  }
});

