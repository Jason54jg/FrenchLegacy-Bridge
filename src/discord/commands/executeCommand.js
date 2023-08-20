const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const messages = require("../../../messages.json");

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

  execute: async (interaction) => {
    const user = interaction.member;
    if (config.discord.commands.checkPerms === true && user.roles.cache.has(config.discord.commands.adminRole) === false) {
      throw new HypixelDiscordChatBridgeError("Vous n'êtes pas autorisé à utiliser cette commande.");
      }

    const command = interaction.options.getString("command");
    bot.chat(`/${command}`);

    const commandMessage = new EmbedBuilder()
      .setTitle("La commande a été exécutée avec succès")
      .setDescription(`\`/${command}\`\n`)
      .setFooter({
        text: `${messages.footerhelp}`,
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    await interaction.followUp({ embeds: [commandMessage], ephemeral: true });
  },
};
