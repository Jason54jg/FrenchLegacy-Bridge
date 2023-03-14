const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require("../../../config.json");
const messages = require('../../../messages.json');

module.exports = {
    name: 'ticketembed',
    description: `Commande pour les embeds des ticket`,

    execute: async (interaction, client) => {
        // Si l'utilisateur n'a pas la permission d'utiliser la commande
        if (!(await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole)) {
            return await interaction.reply({
                content: `${messages.permissionInsuffisante}`,
                ephemeral: true,
            });
        }

        interaction.channel.send({
            embeds: [{
                title: 'Crée un ticket',
                description: 'Réagissez avec <:PencilOof:1040865260267122759> pour créer un ticket\n\nTicket support (à utiliser seulement en cas de problème)',
                footer: { text: 'FrenchLegacy', icon_url: `${messages.iconurl}` },
            }],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('ticket')
                            .setEmoji('1040865260267122759')
                            .setStyle(ButtonStyle.Primary),
                    )
            ]
        })
    },
};