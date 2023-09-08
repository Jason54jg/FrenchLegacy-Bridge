const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const messages = require("../../../messages.json");

module.exports = {
  name: "blacklist",
  description: "Blacklist un utilisateur",
  options: [
    {
      name: "arg",
      description: "Ajouter ou retirer",
      type: 3,
      required: true,
      choices: [
        {
          name: "Add",
          value: "add",
        },
        {
          name: "Remove",
          value: "remove",
        },
      ],
    },
    {
      name: "name",
      description: "Pseudo Minecraft",
      type: 3,
      required: true,
    },
  ],

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

    const name = interaction.options.getString("name");
    const arg = interaction.options.getString("arg").toLowerCase();

    if (arg == "add") {
      bot.chat(`/ignore add ${name}`);
    } else if (arg == "remove") {
      bot.chat(`/ignore remove ${name}`);
    } else {
      throw new HypixelDiscordChatBridgeError(
        "Utilisation incorrecte: `/ignore [add/remove] [nom]`.",
      );
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: "Blacklist" })
      .setDescription(
        `Exécuté avec succès \`/ignore ${arg} ${name}\`\nRegarde dans <#1014148236132483112>`,
      )
      .setFooter({
        text: `${messages.footerhelp}`,
        iconURL:
          "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png",
      });

    await interaction.followUp({
      embeds: [embed],
    });
  },
};
