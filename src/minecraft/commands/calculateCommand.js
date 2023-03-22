const {
  addCommas,
  formatNumber,
} = require("../../contracts/helperFunctions.js");const minecraftCommand = require("../../contracts/minecraftCommand.js");
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
      const calculation = this.getArgs(message)
        .join(" ")
        .replace(/[^-()\d/*+.]/g, "");
      const answer = eval(calculation);

      if (answer === Infinity) {
        return this.send(`/msg ${username} Quelque chose s'est mal passé..`);
      }

      if (answer < 100000) {
        return this.send(`/msg ${username} ${calculation} = ${addCommas(answer)}`);
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
