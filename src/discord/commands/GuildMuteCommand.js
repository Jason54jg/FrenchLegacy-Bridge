const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const messages = require("../../../messages.json");

module.exports = {
  name: "gmute",
  description: "Mute un utilisateur donné pendant une durée donnée.",
  options: [
    {
      name: "name",
      description: "Pseudo Minecraft",
      type: 3,
      required: true,
    },
    {
      name: "temps",
      description: "Temps",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const user = interaction.member;
    if (
      config.discord.commands.checkPerms === true &&
      !(
        user.roles.cache.has(config.discord.commands.staffRole) ||
        config.discord.commands.users.includes(user.id)
      )
    ) {
      throw new HypixelDiscordChatBridgeError(
        "Vous n'êtes pas autorisé à utiliser cette commande.",
      );
    }

    const [name, time] = [
      interaction.options.getString("name"),
      interaction.options.getString("time"),
    ];
    bot.chat(`/g mute ${name} ${time}`);

    const embed = new EmbedBuilder()
      .setAuthor({ name: "Mute" })
      .setDescription(
        `Exécuté avec succès \`/g mute ${name} ${time}\`\nRegarde dans <#1014148236132483112>`,
      )
      .setFooter({
        text: `${messages.footerhelp}`,
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    await interaction.followUp({
      embeds: [embed],
    });
  },
};
