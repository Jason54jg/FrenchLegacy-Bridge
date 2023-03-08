const pointLb = require('../fonction_pour_bot/point-leaderboard');

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        // Commande: points-leaderboard
        if (interaction.isButton()) {
            if (interaction.customId.includes("lb-points-")) {

                // Un bouton de l'interaction a été cliqué: on change de page du leaderboard
                const pageSelected = parseInt(interaction.customId.split('-')[2], 10);
                const lbres = await pointLb.createPointLeaderboardPage(pageSelected);

                if (lbres == null) {
                    return await interaction.reply({
                        content: "Une erreur est survenue lors de l'exécution de la requête vers la base de données.",
                        ephemeral: true,
                    });
                }

                return interaction.update({ embeds: lbres[0], components: lbres[1] });

            }
        }
    }
}