const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const config = require("../../../config.json");
const messages = require("../../../messages.json");

module.exports = {
  name: "candidatureembed",
  description: `Commande pour les embeds des candidature`,

  execute: async (interaction, client) => {
    // Si l'utilisateur n'a pas la permission d'utiliser la commande
    if (
      !(
        await interaction.guild.members.fetch(interaction.user)
      ).roles.cache.has(config.discord.commands.adminRole)
    ) {
      return await interaction.reply({
        content: `${messages.permissionInsuffisante}`,
        ephemeral: true,
      });
    }
    const candidature = new EmbedBuilder()
      .setDescription("# Demandes de recrutement")
      .addFields({
        name: "\u200b",
        value:
          "French Legacy possède deux guildes. La guilde principale (French Legacy) et la deuxième guilde (French Legacy II). Si vous souhaitez postuler pour l'une des guildes, réagissez ci-dessous pour créer un ticket.\n\n* Requirements\nFrench Legacy : Skyblock Level 310\nFrench Legacy II : Skyblock Level 230\n\nPour vérifier votre niveau, rendez-vous dans le salon <#953370740827254834> et écrivez /level <Pseudo>. N'ouvrez pas un ticket juste pour vérifier votre niveau. Cela pourrait entraîner des sanctions telles que l'interdiction de postuler à nouveau.",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    interaction.channel.send({
      embeds: [candidature],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("candidature-v1")
            .setLabel("French Legacy")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("candidature-v2")
            .setLabel("French Legacy II")
            .setStyle(ButtonStyle.Success),
        ),
      ],
    });
  },
};
