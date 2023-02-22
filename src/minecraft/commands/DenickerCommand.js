const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const config = require("../../../config.json");
const axios = require("axios");

class DenickerCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "denick";
    this.aliases = [];
    this.description = "Denick nom d'utilisateur de l'utilisateur spécifié.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0];
      const { data } = await axios.get(
        `${config.minecraft.API.antiSniperAPI}/denick?key=${config.minecraft.API.antiSniperKey}&nick=${username}`
      );

      if (data.player?.ign == null) {
        return this.send("/gc Désolé, je n'ai pas pu trouvé le vrai nom de cette personne.");
      }

      const player = await hypixel.getPlayer(data.player?.ign);

      this.send(
        `/gc ${player.rank ? `[${player.rank}] ` : ``}${
          data.player?.ign
        } a caché son nom en ${data.player.queried_nick}`
      );
    } catch (error) {
      this.send(`/gc Erreur: ${error?.response?.data?.error || error}`);
    }
  }
}

module.exports = DenickerCommand;
