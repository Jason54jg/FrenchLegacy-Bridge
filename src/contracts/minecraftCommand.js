const helperFunctions = require("./helperFunctions.js");
const config = require("../../config.json");

class minecraftCommand {
  constructor(minecraft) {
    this.minecraft = minecraft;
  }

  getArgs(message) {
    const args = message.split(" ");

    args.shift();

    return args;
  }

  send(message) {
    if (this.minecraft.bot.player !== undefined) {
      if (config.minecraft.bot.messageRepeatBypass) {
        const string = helperFunctions.generateID(
          config.minecraft.bot.messageRepeatBypassLength
        );
        this.minecraft.bot.chat(message + " - " + string);
      } else {
        this.minecraft.bot.chat(message);
      }
    }
  }

  onCommand(player, message) {
    throw new Error("La méthode de commande n'est pas encore implémentée!");
  }
}

module.exports = minecraftCommand;
