const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getFetchur } = require("../../../API/functions/getFetchur.js");

class FetchurCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "fetchur";
    this.aliases = [];
    this.description = "Information about an item for Fetchur.";
    this.options = [];
  }

  async onCommand(username, message) {
    try {
      const fetchur = getFetchur();

      this.send(`/gc Fetchur du jour » ${fetchur.text} | Description: ${fetchur.description}`);

    } catch (error) {
      
      this.send(`/gc Erreur: ${error || "Quelque chose s'est mal passé.."}`);
    }
  }
}

module.exports = FetchurCommand;
