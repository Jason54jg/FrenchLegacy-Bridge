const DB = require("../../../API/database/database.js");
const config = require("../../../config.json");
const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");

async function manageGiveaway(client) {
    // Mettre fin aux giveaway qui arrive a la date de tirage
    const giveaways = await DB.getGiveaways();

    giveaways.forEach(giveaway => {
        if (new Date(giveaway.endDate).getTime() > Date.now()) { return; }
        // Supprimer le giveaway de la DB
        DB.deleteGiveaway(giveaway._id);

        // Réaliser le tirage
        let participants = giveaway.participants;
        let winners = "";

        const nbWinner = giveaway.winners;
        for (let i = 0; i < nbWinner && participants.length > 0; i++) {
            let winnerIndex = Math.floor(Math.random() * participants.length);
            let winner = participants[winnerIndex];
            winners += `<@${winner}> `;
            for (let j = 0; j < participants.length; j++) {
                if (participants[j] == winner) {
                    participants.splice(j, 1);
                    j--;
                }

            }
        }

        // Afficher le(s) gagnant(s)
        const giveawayChannel = client.channels.cache.get(config.discord.channels.giveawayChannel);

        const embed = new EmbedBuilder()
            .setTitle(`Fin du giveaway **${giveaway.name}**`)
            .setDescription(`${winners.length == 0 ?
                "Malheureusement, personne n'a pensé à participer a ce giveaway..." :
                `Félicitation à ${winners} qui remporte${nbWinner > 1 ? "nt" : ""} le giveaway !`}`
            );

        giveawayChannel.send({
            content: winners.length == 0 ? "Pensez a participer la prochaine fois !!" : winners,
            embeds: [embed],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`giveawayWinInfo`)
                            .setLabel(`Que faire si j'ai gagné ?`)
                            .setStyle(ButtonStyle.Secondary)
                    )
            ]
        })
    })
}

module.exports = { manageGiveaway }