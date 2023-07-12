const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getFetchur } = require("../../../API/functions/getFetchur.js");

class FetchurCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "fetchur";
    this.aliases = [];
    this.description = "Informations sur un article pour Fetchur.";
    this.options = [];
  }

  async onCommand(username, message) {
    try {
      const { text, description } = getFetchur();

      this.send(`/msg ${username} Fetchur: ${text} | Description: ${description}`);

    } catch (error) {

      this.send(`/msg ${username} Erreur: ${error || "Quelque chose s'est mal passé.."}`);
    }
  }
}

module.exports = FetchurCommand;
