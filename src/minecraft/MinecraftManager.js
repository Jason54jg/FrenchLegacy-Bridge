const CommunicationBridge = require("../contracts/CommunicationBridge.js");
const StateHandler = require("./handlers/StateHandler.js");
const ErrorHandler = require("./handlers/ErrorHandler.js");
const ChatHandler = require("./handlers/ChatHandler.js");
const CommandHandler = require("./CommandHandler.js");
const config = require("../../config.json");
const mineflayer = require("mineflayer");
const Filter = require("bad-words");
const Logger = require("../Logger");
const filter = new Filter();

class MinecraftManager extends CommunicationBridge {
  constructor(app) {
    super();

    this.app = app;

    this.stateHandler = new StateHandler(this);
    this.errorHandler = new ErrorHandler(this);
    this.chatHandler = new ChatHandler(this, new CommandHandler(this));
  }

  connect() {
    global.bot = this.createBotConnection();
    this.bot = bot;

    this.errorHandler.registerEvents(this.bot);
    this.stateHandler.registerEvents(this.bot);
    this.chatHandler.registerEvents(this.bot);

    require("./other/eventNotifier.js");
    require("./other/skyblockNotifier.js");
  }

  createBotConnection() {
    return mineflayer.createBot({
      host: "mc.hypixel.net",
      port: 25565,
      username: config.discord.bot.usernameBot,
      auth: "microsoft",
      version: "1.8.9",
      viewDistance: "tiny",
      chatLengthLimit: 256,
      profilesFolder: "../../auth-cache",
    });
  }

  async onBroadcast({ channel, username, message, replyingTo }) {
    Logger.broadcastMessage(`${username}: ${message}`, "Minecraft");
    if (this.bot.player === undefined) {
      return;
    }

    if (username.includes("|")) {
      username = username.split(" | ")[1];
    }

    if (
      channel === config.discord.channels.debugChannel &&
      config.discord.channels.debugMode === true
    ) {
      return this.bot.chat(message);
    }

    const symbol = config.minecraft.bot.messageFormat;

    if (config.discord.other.filterMessages) {
      message = filter.clean(message);
    }

    if (channel === config.discord.channels.guildChatChannel) {
      return this.bot.chat(
        `/gc ${replyingTo ? `${username} replying to ${replyingTo}${symbol}` : `${username}${symbol}`} ${message}`
      );
    }

    if (channel === config.discord.channels.officerChannel) {
      return this.bot.chat(
        `/oc ${replyingTo ? `${username} replying to ${replyingTo}${symbol}` : `${username}${symbol}`} ${message}`
      );
    }
  }
}

module.exports = MinecraftManager;
