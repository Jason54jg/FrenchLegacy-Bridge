const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");
const messages = require('../../../messages.json');

module.exports = {
    name: "execute",
    description: "Exécute les commandes en tant que bot minecraft.",
    options: [
        {
            name: "commande",
            description: "Commande Minecraft",
            type: 3,
            required: true,
        },
    ],

    execute: async (interaction, client) => {
        // Si l'utilisateur n'a pas la permission d'utiliser la commande
        if (!(await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole)) {
            return await interaction.reply({
                content: `${messages.permissionInsuffisante}`,
                ephemeral: true,
            });
        }
        const command = interaction.options.getString("commande");
        bot.chat(`/${command}`);
        const commandMessage = new EmbedBuilder()
            .setTitle(`${messages.commandeRéussi}`)
            .setDescription(`\`/${command}\`\n`)
            .setFooter({
                iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
            });
        await interaction.reply({ embeds: [commandMessage], ephemeral: true });
    }
};
