const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const messages = require('../../../messages.json');

module.exports = {
    name: "ginvite",
    description: "Invite l'utilisateur dans la guilde.",
    options: [
        {
            name: "name",
            description: "Pseudo Minecraft",
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
        const name = interaction.options.getString("name");
        bot.chat(`/g invite ${name}`);
        const embed = new EmbedBuilder()
          .setTitle(`${messages.commandeRéussi}`)
          .setDescription("Regarde dans <#1014148236132483112>")
          .setTimestamp()
          .setFooter({
            text: `${messages.footerhelp}`,
            iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
          });
        await interaction.reply({ embeds: [embed] });
    },
};
