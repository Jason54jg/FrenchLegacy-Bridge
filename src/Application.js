const DiscordManager = require("./discord/DiscordManager.js");
const MinecraftManager = require("./minecraft/MinecraftManager.js");
const Bot2 = require("./minecraft/Bot2.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Application {
  async register() {
    this.discord = new DiscordManager(this);
    this.minecraft = new MinecraftManager(this);
    this.Bot2 = new Bot2(this);

    this.discord.setBridge(this.minecraft);
    this.minecraft.setBridge(this.discord);
    this.discord.setBridge(this.Bot2); //Problème a corrigé le Bot de discord n'envoie que dans une seule guilde et réecri c'est propre message
    this.Bot2.setBridge(this.discord);
  }

  async connect() {
    this.discord.connect();
    this.minecraft.connect();
    await delay(4000);
    this.Bot2.connect();
  }
}

module.exports = new Application();
