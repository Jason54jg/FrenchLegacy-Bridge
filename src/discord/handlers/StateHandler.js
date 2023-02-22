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
    this.discord.client.user.setPresence({
      activities: [
        { name: `/help`, type: ActivityType.Playing },
      ],
    });
    const channel = await getChannel("Logger");
    global.bridgeChat = config.discord.guildChatChannel;
    global.uptime = new Date().getTime();

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
    return client.channels.fetch(config.discord.officerChannel);
  } else if (type == "Logger") {
    return client.channels.fetch(config.discord.loggingChannel);
  } else if (type == "debugChannel") {
    return client.channels.fetch(config.console.debugChannel);
  } else {
    return client.channels.fetch(config.discord.guildChatChannel);
  }
}

module.exports = StateHandler;
