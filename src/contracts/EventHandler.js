class EventHandler {
  registerEvents(bot) {
    throw new Error(
      "Le gestionnaire d'événements n'est pas encore implémenté!",
    );
  }
  send(message) {
    if (this.minecraft.bot.player !== undefined) {
      this.minecraft.bot.chat(message);
    }
  }
}

module.exports = EventHandler;
