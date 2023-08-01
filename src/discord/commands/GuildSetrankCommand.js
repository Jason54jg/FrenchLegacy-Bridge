const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const messages = require("../../../messages.json");

module.exports = {
  name: "gsetrank",
  description: "Définir les rangs d'un utilisateur",
  options: [
    {
      name: "name",
      description: "Pseudo Minecraft",
      type: 3,
      required: true,
    },
    {
      name: "rang",
      description: "Le rang auquel vous souhaitez attribuer à l'utilisateur",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const user = interaction.member;
    if (user.roles.cache.has(config.discord.roles.commandRole) === false) {
      throw new Error("Vous n'êtes pas autorisé à utiliser cette commande.");
    }

    const name = interaction.options.getString("user");
    const rang = interaction.options.getString("rang");

    bot.chat(`/g setrank ${name} ${rang}`);

    const embed = new EmbedBuilder()
      .setAuthor({ name: "Setrank" })
      .setDescription(`Exécuté avec succès \`/g setrank ${name} ${rang}\`\nRegarde dans <#1014148236132483112>`)
      .setTimestamp()
      .setFooter({
        text: `${messages.footerhelp}`,
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    await interaction.followUp({
      embeds: [embed],
    });
  },
};
