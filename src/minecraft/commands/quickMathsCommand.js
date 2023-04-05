const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getAnswer = (message) => {
  if (message.includes(config.minecraft.bot.messageFormat)) {
    return message.split(config.minecraft.bot.messageFormat)[1].trim();
  }

  return message.split(": ")[1];
};

class QuickMathsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "quickmaths";
    this.aliases = ["qm"];
    this.description =
    "Résolvez l'équation en moins de 10 secondes ! Testez vos compétences en mathématiques!";
    this.options = [];
  }

  async onCommand(username, message) {
    try {
      const userUsername = username;
      const operands = [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ];
      const operators = ["+", "-", "*"];
      const operator = operators[Math.floor(Math.random() * operators.length)];

      const equation = `${operands[0]} ${operator} ${operands[1]}`;
      const answer = eval(operands.join(operator));
      const headStart = 250;

      this.send(`/gc ${username} Qu'est-ce que ${equation}? (Vous avez ${headStart}ms d'avance)`);
      await delay(headStart);

      const startTime = Date.now();
      let answered = false;

      const listener = (username, message) => {
        if (getAnswer(message) !== answer.toString()) {
          return;
        }

        answered = true;
        this.send(`/gc ${userUsername} Correct! Il vous a fallu ${(Date.now() - startTime).toLocaleString()}ms`);
        bot.removeListener("chat", listener);
      };

      bot.on("chat", listener);

      setTimeout(() => {
        bot.removeListener("chat", listener);

        if (!answered) {
          this.send(`/gc ${userUsername} Le temps est écoulé! La réponse était ${answer}`);
        }
      }, 10000);

    } catch (error) {
      this.send(`/gc ${username} Erreur: ${error || "Quelque chose a mal tournég.."}`);
    }
  }
}

module.exports = QuickMathsCommand;