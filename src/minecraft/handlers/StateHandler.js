const eventHandler = require("../../contracts/EventHandler.js");
// eslint-disable-next-line
const Logger = require("../../Logger.js");

class StateHandler extends eventHandler {
  constructor(minecraft) {
    super();

    this.minecraft = minecraft;
    this.loginAttempts = 0;
    this.exactDelay = 0;
  }

  registerEvents(bot) {
    this.bot = bot;

    this.bot.on("login", (...args) => this.onLogin(...args));
    this.bot.on("end", (...args) => this.onEnd(...args));
    this.bot.on("kicked", (...args) => this.onKicked(...args));
  }

  onLogin() {
    Logger.minecraftMessage("Client prêt, connecté en tant que " + this.bot.username);

    this.loginAttempts = 0;
    this.exactDelay = 0;
  }

  onEnd() {
    const loginDelay =
      this.exactDelay > 60000 ? 60000 : (this.loginAttempts + 1) * 500000;

    Logger.warnMessage(
      `Le bot Minecraft s'est déconnecté! Tentative de reconnexion dans ${
        loginDelay / 1000
      } secondes`
    );

    setTimeout(() => this.minecraft.connect(), loginDelay);
  }

  onKicked(reason) {
    Logger.warnMessage(
      `Le bot Minecraft a été expulsé du serveur pour "${reason}"`
    );

    this.loginAttempts++;
  }
}

module.exports = StateHandler;
