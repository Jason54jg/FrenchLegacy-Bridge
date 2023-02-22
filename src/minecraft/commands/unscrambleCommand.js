const { getRandomWord, scrambleWord } = require("../constants/words.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getWord = (message) => message.split(" ").pop();

const cooldowns = new Map();

class unscrambleCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "unscramble";
    this.aliases = ["déchiffrer", "unscrambleme", "unscrambleme", "us"];
    this.description = "Déchiffrez le mot et tapez-le dans le chat pour gagner!";
    this.options = [
      {
        name: "length",
        description: "Longueur du mot à déchiffrer",
        required: false,
      }
    ];
  }

  async onCommand(username, message) {
    try {
      const length = this.getArgs(message)[0];
      const answer = getRandomWord(length);
      const scrambledWord = scrambleWord(answer);

      const cooldownDuration = 30 * 1000; // 10 seconds

      if (cooldowns.has(this.name)) {
        const lastTime = cooldowns.get(this.name);
        const elapsedTime = Date.now() - lastTime;
        const remainingTime = cooldownDuration - elapsedTime;

        if (remainingTime < 0) {
          return this.send(`/gc Veuillez patienter jusqu'à la fin de la partie en cours.`);
        }
      }

      let answered = false;
      cooldowns.set(this.name, Date.now());
      const listener = (username, message) => {
        if (username === bot.username) return;

        if (getWord(message) === answer) {
          this.send(
            `/gc ${username} a bien deviné! Temps écoulé: ${Date.now() - startTime}ms!`
          );

          bot.removeListener("chat", listener);
          answered = true;
        }
      };

      bot.on("chat", listener);
      this.send(`/gc Décryptez le mot suivant: "${scrambledWord}"`);
      const startTime = Date.now();

      setTimeout(() => {
        bot.removeListener("chat", listener);

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