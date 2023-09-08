const config = require("../../../config.json");
const Logger = require("../../Logger.js");

class StateHandler {
  constructor(discord) {
    this.discord = discord;
  }

  async onReady() {
    Logger.discordMessage(
      "Client prêt, connecté en tant que " + this.discord.client.user.tag,
    );
  }

  async getChannel(type) {
    if (type == "Officer") {
      return client.channels.fetch(config.discord.channels.officerChannel);
    } else if (type == "Logger") {
      return client.channels.fetch(config.discord.channels.loggingChannel);
    } else if (type == "debugChannel") {
      return client.channels.fetch(config.discord.channels.debugChannel);
    } else {
      return client.channels.fetch(config.discord.channels.guildChatChannel);
    }
  }
}

module.exports = StateHandler;
