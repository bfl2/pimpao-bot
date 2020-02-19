
function commandResolver(channel, user, message) {
  const command = recognizeCommand(message);

  if (!command) return;

  return command;
}

let recognizeCommand = message => {
  const lowerCaseMessage = message.toLowerCase();
  const regex = /\!(.*?)$/gm;
  const fullCommand = regex.exec(lowerCaseMessage);

  if (fullCommand) {
    const splittedCommand = fullCommand[1].split(" ");
    const command = splittedCommand[0];

    splittedCommand.shift(); // remove command from array

    return {
      command: command,
      args: splittedCommand
    };
  }

  return false;
};

export default (channel, user, message) => {
  return commandResolver(channel, user, message);
};
