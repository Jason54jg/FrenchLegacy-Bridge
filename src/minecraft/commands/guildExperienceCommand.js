const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");

class GuildExperienceCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "guildexp";
    this.aliases = ["gexp"];
    this.description = "Expérience de guildes de l'utilisateur spécifié.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    username = this.getArgs(message)[0] || username;

    try {
      const [uuid, guild] = await Promise.all([
        getUUID(username),
        hypixel.getGuild("player", username),
      ]);

      const player = guild.members.find((member) => member.uuid == uuid);

      if (player === undefined) {
        // eslint-disable-next-line no-throw-literal
        throw "Le joueur n'est pas dans la guilde.";
      }

      this.send(
        `/gc Expérience de guilde hebdomadaire de ${username}: ${player.weeklyExperience.toLocaleString()}.`
      );
    } catch (error) {
      this.send(
        `/gc ${error
          .toString()
          .replace("[hypixel-api-reborn] ", "")}`
      );
    }
  }
}

module.exports = GuildExperienceCommand;
