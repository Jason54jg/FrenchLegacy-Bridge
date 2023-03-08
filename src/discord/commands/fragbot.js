const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "fragbot",
    description: "Commande pour les fragbot",

    execute: async (interaction, client) => {

        const information = new EmbedBuilder()
            .addFields(
                { name: "Comment obtenir le pseudo d'un bot ?", value: "Pour trouver le pseudo d'un bot, il suffit de regarder dans ce channel." },
                { name: "Comment invité le fragbot ?", value: "Étape 1 : Crée une partie avec le bot, vous pouvez le faire en utilisant /p <nom du bot>.\nÉtape 2 : Entrez dans un donjon pendant que le bot est dans votre groupe.\nÉtape 3 : Profiter\nÉtape 4 : Répéter" },
            )
            .setFooter({
                text: "FrenchLegacy",
                iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
            });

        const FrenchBot = new EmbedBuilder()
            .setTitle('FrenchBot Logs')
            .addFields({
                name: 'Connecté : ✅',
                value: '\u200B'
            })
            .setFooter({
                text: "FrenchLegacy",
                iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
            });

        interaction.reply({ embeds: [information, Cartouche, FrenchBot] });
    },
};