const minecraftCommand = require("../../contracts/minecraftCommand.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class warpoutCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "warpout";
    this.aliases = ["warp"];
    this.description = "Warp un joueur hors du lobby";
    this.options = [];

    this.isOnCooldown = false;
  }

  async onCommand(username, message) {
    try {
      if (this.isOnCooldown) {
        return this.send(`/msg ${username} La commande est en cooldown`);
      }

      this.isOnCooldown = true;

      const user = this.getArgs(message)[0];
      if (user === undefined) throw "Veuillez fournir un nom d'utilisateur!";

      const warpoutListener = async (message) => {
        message = message.toString();

        if (message.includes("You cannot invite that player since they're not online.")) {
          this.send(`/msg ${username} ${user} n'est pas en ligne!`);
          this.isOnCooldown = false;
        }

        if (message.includes("You cannot invite that player!")) {
          this.send(`/gc ${user} a désactivé les demandes de partie!`);
          this.isOnCooldown = false;
        }

        if (message.includes("invited") &&message.includes("to the party! They have 60 seconds to accept.")) {
          this.send(`/msg ${username} ${user} a été invité avec succès à la partie!`);
        }

        if (message.includes(" joined the party.")) {
          this.send(`/msg ${username} ${user} rejoint la partie ! Je le fait quitter le lobby..`);
          await delay(1100);

          bot.chat("/p warp");
        }

        if (message.includes(" is not allowed on your server!")) {
          this.send(`/msg ${username} ${user} n'est pas autorisé sur le serveur! Suppression de la partie..`);
          this.isOnCooldown = false;

          await delay(1000);
          bot.chat("/p leave");
        }

        if (message.includes("warped to your server")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`/msg ${username} ${user} a été warp du lobby! Suppression de la partie..`);

          await delay(1000);
          bot.chat("/p disband");
        }

        if (message.includes("You are not allowed to invite players.")) {
          this.send(`/msg D'une manière ou d'une autre, je ne suis pas autorisé à inviter des joueurs?`);
          this.isOnCooldown = false;

          await delay(1000);
          bot.chat("/p disband");
        }

        if (message.includes("You are not allowed to disband this party.")) {
          this.send(`/msg D'une manière ou d'une autre, je n'ai pas le droit de dissoudre ce parti?`);
          this.isOnCooldown = false;

          await delay(1000);
          bot.chat("/p leave");
        }
      };

      await bot.on("message", warpoutListener);
      bot.chat(`/p ${user}`);

      setTimeout(async () => {
        bot.removeListener("message", warpoutListener);

        if (this.isOnCooldown === true) {
          this.send(`/msg ${username} Délai de l'invitation à la partie à expiré.`);
          await delay(1000);
          bot.chat("/p disband");

          this.isOnCooldown = false;
        }
      }, 30000);
    } catch (error) {
      this.send(`/msg ${username} Erreur: ${error || "Quelque chose s'est mal passé.."}`);

      this.isOnCooldown = false;
    }
  }
}

module.exports = warpoutCommand;