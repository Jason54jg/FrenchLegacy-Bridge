const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const messages = require("../../../messages.json");

module.exports = {
  name: "gmotdclear",
  description: "Clears le MOTD",

  execute: async (interaction) => {
    const user = interaction.member;
    if (
      config.discord.commands.checkPerms === true &&
      !(
        user.roles.cache.has(config.discord.commands.adminRole) ||
        config.discord.commands.users.includes(user.id)
      )
    ) {
      throw new HypixelDiscordChatBridgeError(
        "Vous n'êtes pas autorisé à utiliser cette commande.",
      );
    }

    bot.chat(`/g motd clear`);

    const embed = new EmbedBuilder()
      .setAuthor({ name: "MOTD Clear" })
      .setDescription(
        `Exécuté avec succès \`/g motd clear\`\nRegarde dans <#1014148236132483112>`,
      )
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
