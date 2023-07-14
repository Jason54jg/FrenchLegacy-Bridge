class CommunicationBridge {
  constructor() {
    this.bridge = null;
  }

  getBridge() {
    return this.bridge;
  }

  setBridge(bridge) {
    this.bridge = bridge;
  }

  broadcastMessage(event) {
    return this.bridge.onBroadcast(event);
  }

  broadcastPlayerToggle(event) {
    return this.bridge.onPlayerToggle(event);
  }

  broadcastCleanEmbed(event) {
    return this.bridge.onBroadcastCleanEmbed(event);
  }

  broadcastHeadedEmbed(event) {
    return this.bridge.onBroadcastHeadedEmbed(event);
  }

  connect() {
    throw new Error(
      "La connexion du bridge de communication n'est pas encore implémentée!"
    );
  }

  onBroadcast(event) {
    throw new Error(
      "La gestion de la diffusion du bridge de communication n'est pas encore implémentée!"
    );
  }
}

module.exports = CommunicationBridge;
