const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../../../config.json");
const messages = require("../../../messages.json");

module.exports = {
  name: "ticketembed",
  description: `Commande pour les embeds des ticket`,

  execute: async (interaction) => {
    const user = interaction.member;
    if (user.roles.cache.has(config.discord.roles.commandRole) === false) {
      throw new HypixelDiscordChatBridgeError("Vous n'êtes pas autorisé à utiliser cette commande.");
    }

    interaction.channel.send({
      embeds: [
        {
          title: "Crée un ticket",
          description:
            "Réagissez avec <:PencilOof:1040865260267122759> pour créer un ticket\n\nTicket support (à utiliser seulement en cas de problème)",
          footer: {
            text: "FrenchLegacy",
            icon_url: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
          },
        },
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("ticket")
            .setEmoji("1040865260267122759")
            .setStyle(ButtonStyle.Primary)
        ),
      ],
    });
  },
};
