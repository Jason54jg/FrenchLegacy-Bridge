const config = require("../../../config.json");
const util = require("../fonction_pour_bot/point-leaderboard.js");

module.exports = {
  name: "points-leaderboard",
  description: `Commande pour afficher le leaderboard des points`,

  execute: async (interaction, client) => {
    let lbres = await util.createPointLeaderboardPage(1);

    if (lbres == null) {
      return await interaction.reply({
        content:
          "Une erreur est survenue lors de l'éxecution de la requète vers la base de donnée.",
        ephemeral: true,
      });
    }

    interaction.channel.send({ embeds: lbres[0], components: lbres[1] });
  },
};
