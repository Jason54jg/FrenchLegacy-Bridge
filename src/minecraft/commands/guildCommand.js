const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const {
  capitalize,
  formatNumber,
} = require("../../contracts/helperFunctions.js");

class GuildInformationCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "guild";
    this.aliases = ["g"];
    this.description = "Afficher les informations d'une guilde";
    this.options = [
      {
        name: "guild",
        description: "Guild name",
        required: true,
      },
    ];
  }

  async onCommand(username, message) {
    try {
      const guildName = this.getArgs(message)
        .map((arg) => capitalize(arg))
        .join(" ");

      const guild = await hypixel.getGuild("name", guildName);

      this.send(
        `/gc Guild ${guildName} | Tag: [${guild.tag}] | Members: ${
          guild.members.length
        } | Niveau: ${guild.level} | GEXP hebdomadaire: ${formatNumber(
          guild.totalWeeklyGexp,
        )}`,
      );
    } catch (error) {
      this.send(
        `/gc ${error
          .toString()
          .replace("[hypixel-api-reborn] ", "")
          .replace("Pour obtenir de l'aide, rejoignez notre serveur Discord https://discord.gg/Fpm9qvKbbV", "")}`
      );
    }
  }
}

module.exports = GuildInformationCommand;
