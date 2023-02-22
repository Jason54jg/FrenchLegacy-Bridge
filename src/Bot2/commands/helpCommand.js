const minecraftCommand = require("../../contracts/minecraftCommand.js");

class HelpCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "help";
    this.aliases = ["info"];
    this.description = "Affiche le menu d'aide";
    this.options = [];
    this.optionsDescription = [];
  }

  onCommand(username, message) {
    try {
      this.send(`/gc https://imgur.com/a/Itisykh`);
    } catch (error) {
      this.send("/gc Quelque chose s'est mal passé..");
    }
  }
}

module.exports = HelpCommand;
