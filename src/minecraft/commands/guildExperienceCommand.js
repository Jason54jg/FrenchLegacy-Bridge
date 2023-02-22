const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { addCommas } = require("../../contracts/helperFunctions.js");
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
    const arg = this.getArgs(message);
    if (arg[0]) username = arg[0];

    try {
      const [uuid, guild] = await Promise.all([
        getUUID(username),
        hypixel.getGuild("player", username),
      ]);

      const player = guild.members.find((member) => member.uuid == uuid);

      if (!player) throw "Le joueur n'est pas dans la guilde.";

      this.send(
        `/gc ${
          username == arg[0] ? `${arg[0]}` : `Ton`
        } Expérience de guilde hebdomadaire: ${addCommas(player.weeklyExperience)}.`
      );

    } catch (error) {
      this.send(`/gc ${error.toString().replace("[hypixel-api-reborn] ", "")}`);
    }
  }
}

module.exports = GuildExperienceCommand;
