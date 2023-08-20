const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const messages = require("../../../messages.json");

module.exports = {
  name: "gpromote",
  description: "Promote l'utilisateur donné d'un rang supérieur.",
  options: [
    {
      name: "name",
      description: "Pseudo Minecraft",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const user = interaction.member;
    if (config.discord.commands.checkPerms === true && user.roles.cache.has(config.discord.commands.adminRole) === false) {
      throw new HypixelDiscordChatBridgeError("Vous n'êtes pas autorisé à utiliser cette commande.");
    }

    const name = interaction.options.getString("name");
    bot.chat(`/g promote ${name}`);

    const embed = new EmbedBuilder()
      .setAuthor({ name: "Promote" })
      .setDescription(`Exécuté avec succès \`/g promote ${name}\`\nRegarde dans <#1014148236132483112>`)
      .setFooter({
        text: `${messages.footerhelp}`,
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    await interaction.followUp({
      embeds: [embed],
    });
  },
};
