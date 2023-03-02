const pointLb = require('../fonction_pour_bot/point-leaderboard');

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        // Commande: points-leaderboard
        if (interaction.isButton()) {
            if (interaction.customId.includes("lb-points-")) {

                // Un bouton de l'interaction a été cliqué: on change de page du leaderboard
                const pageSelected = interaction.customId.split('-')[2];
                const lbres = await pointLb.createPointLeaderboardPage(pageSelected);

                if (lbres == null) {
                    return await interaction.followUp({
                        content: "Une erreur est survenue lors de l'éxecution de la requéte vers la base de donnée.",
                        ephemeral: true,
                    });
                }

                interaction.message.edit({ embeds: lbres[0], components: lbres[1] });

            }
        }
    }
}