const { formatNumber } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");

class CalculateCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "calculate";
    this.aliases = ["calc", "math"];
    this.description = "Calculate.";
    this.options = [
      {
        name: "calculation",
        description: "Tout type d'équation mathématique",
        required: true,
      },
    ];
  }

  onCommand(username, message) {
    try {
      const calculation = message.replace(/[^-()\d/*+.]/g, "");
      const answer = eval(calculation);

      if (answer === Infinity) {
        return this.send(
          `/msg ${username} Quelque chose s'est mal passé. D'une manière ou d'une autre, vous l'avez cassé (la réponse était l'infini)`
        );
      }

      this.send(
        `/msg ${username} ${calculation} = ${formatNumber(
          answer
        )} (${answer.toLocaleString()})`
      );
    } catch (error) {
      this.send(`/msg ${username} Erreur: ${error}`);
    }
  }
}

module.exports = CalculateCommand;
