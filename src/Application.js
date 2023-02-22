const DiscordManager = require("./discord/DiscordManager.js");
const MinecraftManager = require("./minecraft/MinecraftManager.js");
const Bot2 = require("./Bot2/Bot2.js");

class Application {
  async register() {
    this.discord = new DiscordManager(this);
    this.minecraft = new MinecraftManager(this);
    this.Bot2 = new Bot2(this);

    this.discord.setBridge(this.minecraft);
    this.minecraft.setBridge(this.discord);
    this.discord.setBridge(this.Bot2);
    this.Bot2.setBridge(this.discord);
  }

  async connect() {
    this.discord.connect();
    this.minecraft.connect();
    this.Bot2.connect();
  }
}

module.exports = new Application();
