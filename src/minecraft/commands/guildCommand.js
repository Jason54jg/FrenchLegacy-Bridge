const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { capitalize } = require("../../contracts/helperFunctions.js");

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
        `/msg ${username} Guilds ${guildName} | Tag: ${guild.tag} | Membres: ${guild.members.length} | Niveau: ${guild.level} | GEXP hebdomadaire: ${guild.totalWeeklyGexp}`
      );
    } catch (error) {
      this.send(`/msg ${username} ${error.toString().replace("[hypixel-api-reborn] ", "")}`);
    }
  }
}

module.exports = GuildInformationCommand;
