/*eslint-disable */
const { ActivityType } = require("discord.js");
const config = require("../../../config.json");
const Logger = require("../../Logger.js");
const res = require("express/lib/response");

/*eslint-enable */

class StateHandler {
  constructor(discord) {
    this.discord = discord;
  }

  async onReady() {
    Logger.discordMessage("Client prêt, connecté en tant que " + this.discord.client.user.tag);
    const channel = await getChannel("Logger");
    global.bridgeChat = config.discord.channels.guildChatChannel;

    channel.send({
      embeds: [
        {
          author: { name: `Le BridgeChat est en ligne` },
          color: 2067276,
        },
      ],
    });

  }

  async onClose() {
    const channel = await getChannel("Logger");
    channel.send({
      embeds: [
        {
          author: { name: `Le BridgeChat est hors ligne` },
          color: 15548997,
        },
      ],
    });
  }
}

async function getChannel(type) {
  if (type == "Officer") {
    return client.channels.fetch(config.discord.channels.officerChannel);
  } else if (type == "Logger") {
    return client.channels.fetch(config.discord.channels.loggingChannel);
  } else if (type == "debugChannel") {
    return client.channels.fetch(config.console.channels.debugChannel);
  } else {
    return client.channels.fetch(config.discord.channels.guildChatChannel);
  }
}

module.exports = StateHandler;
