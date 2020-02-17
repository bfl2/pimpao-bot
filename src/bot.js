import client from "./client";
import { resolve } from "./commandResolver";
client.connect();
import quizServer from "./quizServer";

quizServer.mountServer()

// Commands
client.on("chat", (channel, user, message, self) => {
  if (self) return; // bot message

  // if message has symbol whats mean command - !
  if (message.indexOf("!") !== -1) {
    resolve(channel, user, message);
  }
});

