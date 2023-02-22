const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { capitalize } = require("../../contracts/helperFunctions.js");

class GuildInformationCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "guild";
    this.aliases = ["g"];
    this.description = "View information of a guild";
    
    this.options = ["name"];
    this.optionsDescription = ["Name of the Guild"];
  }

  async onCommand(username, message) {
    try {
      const guildName = this.getArgs(message).map((arg) => capitalize(arg)).join(" ");
      const guild = await hypixel.getGuild("name", guildName)

      this.send(`/gc Guilde ${guildName} | Tag: ${guild.tag} | Membres: ${guild.members.length} | Level: ${guild.level} | GEXP hebdomadaire: ${guild.totalWeeklyGexp}`);
    } catch (error) {
      this.send(`/gc ${error.toString().replace("[hypixel-api-reborn] ", "")}`);
    }
  }
}

module.exports = GuildInformationCommand;
