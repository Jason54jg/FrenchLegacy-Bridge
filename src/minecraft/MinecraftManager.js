/*eslint-disable */
const CommunicationBridge = require("../contracts/CommunicationBridge.js");
const StateHandler = require("./handlers/StateHandler.js");
const ErrorHandler = require("./handlers/ErrorHandler.js");
const ChatHandler = require("./handlers/ChatHandler.js");
const CommandHandler = require("./CommandHandler.js");
const config = require("../../config.json");
const mineflayer = require("mineflayer");
const Filter = require("bad-words");
const Logger = require("../Logger");
/*eslint-enable */
const filter = new Filter();

class MinecraftManager extends CommunicationBridge {
  constructor(app) {
    super();

    this.app = app;

    this.stateHandler = new StateHandler(this);
    this.errorHandler = new ErrorHandler(this);
    this.chatHandler = new ChatHandler(this, new CommandHandler(this));
  }

  connect(type) {
    if (type === "Bot") {
      global.bot = this.createBotConnection(type);
      this.bot = bot;

      this.errorHandler.registerEvents(this.bot);
      this.stateHandler.registerEvents(this.bot);
      this.chatHandler.registerEvents(this.bot);
    } else if (type === "Bot2") {
      global.bot2 = this.createBotConnection(type);
      this.bot2 = bot2;

      this.errorHandler.registerEvents(this.bot2);
      this.stateHandler.registerEvents(this.bot2);
      this.chatHandler.registerEvents(this.bot2);
    }
  }

  createBotConnection(type) {
    return mineflayer.createBot({
      host: "mc.hypixel.net",
      port: 25565,
      username:
        type === "Bot"
          ? config.minecraft.bot.username
          : config.minecraft.bot.username2,
      auth: "microsoft",
      version: "1.8.9",
      viewDistance: "tiny",
      chatLengthLimit: 256,
    });
  }

  async onBroadcast({ channel, username, message, replyingTo }) {
    console.log(channel, username, message, replyingTo);
    Logger.broadcastMessage(`${username}: ${message}`, "Minecraft");
    bridgeChat = channel;

    if (
      channel === config.discord.channels.debugChannel &&
      config.discord.channels.debugMode === true
    ) {
      return this.bot.chat(message);
    }

    const symbol = config.minecraft.bot.messageFormat;

    if (channel === config.discord.channels.guildChatChannel) {
      bot.chat(
        filter.clean(
          `/gc ${
            replyingTo
              ? `${username} répond à ${replyingTo}${symbol}`
              : `${username}${symbol}`
          } ${message}`
        )
      );

      bot2.chat(
        filter.clean(
          `/gc ${
            replyingTo
              ? `${username} répond à ${replyingTo}${symbol}`
              : `${username}${symbol}`
          } ${message}`
        )
      );
    }

    if (channel === config.discord.channels.officerChannel) {
      return config.discord.other.filterMessages
        ? this.bot.chat(
            filter.clean(
              `/oc ${
                replyingTo
                  ? `${username} répond à ${replyingTo}${symbol}`
                  : `${username}${symbol}`
              } ${message}`
            )
          )
        : this.bot.chat(
            `/oc ${
              replyingTo
                ? `${username} répond à ${replyingTo}${symbol}`
                : `${username}${symbol}`
            } ${message}`
          );
    }
  }
}

module.exports = MinecraftManager;
