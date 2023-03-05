const DiscordManager = require("./discord/DiscordManager.js");
const MinecraftManager = require("./minecraft/MinecraftManager.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Application {
  async register() {
    this.discord = new DiscordManager(this);
    this.minecraft = new MinecraftManager(this);
    this.minecraft2 = new MinecraftManager(this);

    this.discord.setBridge(this.minecraft);
    this.minecraft.setBridge(this.discord);
    this.discord.setBridge(this.minecraft2); //Problème a corrigé le Bot de discord n'envoie que dans une seule guilde et réecri c'est propre message
    this.minecraft2.setBridge(this.discord);
  }

  async connect() {
    this.discord.connect();
    this.minecraft.connect("Bot");
    await delay(4000);
    this.minecraft2.connect("Bot2");
  }
}

module.exports = new Application();
