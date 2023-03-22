const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { toFixed } = require("../../contracts/helperFunctions.js");
const config = require("../../../config.json");
const DB = require("../../../API/database/database.js");

module.exports = {
    name: "giveaway",
    description: "Créer un Giveway.",
    options: [
        {
            name: "nom",
            description: "Nom du giveway (prix a gagner)",
            type: 3,
            required: true
        },
        {
            name: "host",
            description: "Host du giveaway",
            type: 6,
            required: true
        },
        {
            name: "gagnant",
            description: "Nombre de personnes pouvant gagner le giveaway",
            type: 4,
            required: true
        },
        {
            name: "date_de_fin",
            description: "Date du tirage au format JJ/MM/AAAA:HH:mm (ex: 01/12/2022:12:30)",
            type: 3,
            required: true
        }
    ],

    execute: async (interaction, client) => {
        // Si l'utilisateur n'a pas la permission d'utiliser la commande
        /*if (!(await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole)) {
            return await interaction.reply({
                content: "Vous n'êtes pas autorisé à exécuter cette commande.",
                ephemeral: true,
            });
        }*/

        const name = interaction.options.get("nom").value;
        const host = interaction.options.get("host").value;
        const winners = interaction.options.get("gagnant").value;
        const date = interaction.options.get("date_de_fin").value;

        // Vérifier si la date renseignée est valide
        if (date.match(/(\d{2}\/){2}\d{4}(:\d{2}){2}/g).length == 0) {
            return await interaction.reply({
                content: "La date renseignée n'est pas valide",
                ephemeral: true,
            });
        }

        // Créer la vrai date
        const d = date.split('/');
        const h = d[2].split(':');
        const dateFormatted = new Date(Date.UTC(h[0], d[1] - 1, d[0], h[1] - 1, h[2]));

        // Préparation du giveaway
        let giveawayId = await DB.createGiveaway(name, dateFormatted, host, winners);

        if (giveawayId == null) {
            return await interaction.reply({
                content: "Une erreur est survenue lors de l'interaction avec la base de donnée",
                ephemeral: true,
            });
        }
        giveawayId = giveawayId.insertedId.toHexString();

        // Préparation de l'embed du giveaway
        const giveawayEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`Giveaway - ${name} - ${winners} Gagnant${winners > 1 ? "s" : ""}`)
            .setDescription(`Merci à <@${host}> qui organise ce giveaway !\n\n`+
                `Vous avez jusqu'au <t:${dateFormatted.valueOf() / 1000}> pour y participer\n` +
                `Fin <t:${+ toFixed(dateFormatted / 1000, 0)}:R>`
            )
            .setFooter({
                text: "FrenchLegacy",
                iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png",
            });
        interaction.reply({
            embeds: [giveawayEmbed],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`giveaway_${giveawayId}`)
                            .setLabel('0 Participants')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId(`giveaway_${giveawayId}_list`)
                            .setLabel('Liste des participants')
                            .setStyle(ButtonStyle.Secondary)
                        )
            ]
        });
    },
};