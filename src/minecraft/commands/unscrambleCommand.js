const { getRandomWord, scrambleWord } = require("../constants/words.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getWord = (message) => message.split(" ").pop();

const cooldowns = new Map();

class unscrambleCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "unscramble";
    this.aliases = ["déchiffrer", "unscrambleme", "unscrambleme", "us"];
    this.description =
      "Déchiffrez le mot et tapez-le dans le chat pour gagner!";
    this.options = [
      {
        name: "length",
        description: "Longueur du mot à déchiffrer",
        required: false,
      },
    ];
    this.cooldown = 30 * 1000;
  }

  async onCommand(username, message) {
    try {
      const userUsername = username;
      const length = this.getArgs(message)[0];
      const answer = getRandomWord(length);
      const scrambledWord = scrambleWord(answer);

      const cooldownDuration = this.cooldown;

      if (cooldowns.has(this.name)) {
        const lastTime = cooldowns.get(this.name);
        const elapsedTime = Date.now() - lastTime;
        const remainingTime = cooldownDuration - elapsedTime;

        if (remainingTime > 0) {
          return this.send(
            `/gc Veuillez patienter jusqu'à la fin de la partie en cours.`,
          );
        }
      }

      let answered = false;
      cooldowns.set(this.name, Date.now());
      const listener = (username, message) => {
        if (getWord(message) === answer) {
          this.send(
            `/gc ${username} a bien deviné! Temps écoulé: ${(
              Date.now() - startTime
            ).toLocaleString()}ms!`,
          );

          bot.removeListener("chat", listener);
          answered = true;
          cooldowns.delete(this.name);
        }
      };

      bot.on("chat", listener);
      this.send(`/gc Décryptez le mot suivant: "${scrambledWord}"`);
      const startTime = Date.now();

      setTimeout(() => {
        bot.removeListener("chat", listener);
        cooldowns.delete(this.name);

        if (answered === false) {
          this.send(`/gc Le temps est écoulé! La réponse était ${answer}`);
        }
      }, 30000);
    } catch (error) {
      this.send(`/gc Error: ${error || "Quelque chose s'est mal passé.."}`);
    }
  }
}

module.exports = unscrambleCommand;
