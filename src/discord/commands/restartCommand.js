const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const config = require("./../../../config.json");
const { EmbedBuilder } = require("discord.js");
const app = require("./../../Application.js");
const messages = require("../../../messages.json");

module.exports = {
  name: "restart",
  description: "Redémarre le bot.",

  execute: async (interaction) => {
    const user = interaction.member;
    if (
      config.discord.commands.checkPerms === true &&
      !(user.roles.cache.has(config.discord.commands.adminRole) || config.discord.commands.users.includes(user.id))
    ) {
      throw new HypixelDiscordChatBridgeError("Vous n'êtes pas autorisé à utiliser cette commande.");
    }

    const restartEmbed = new EmbedBuilder()
      .setTitle("Redémarrage...")
      .setDescription("Le bot redémarre. Cela peut prendre quelques secondes.")
      .setFooter({
        text: `${messages.footerhelp}`,
        iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png",
      });

    interaction.followUp({ embeds: [restartEmbed] });

    await bot.end("restart");
    await client.destroy();

    app.register().then(() => {
      app.connect();
    });

    const successfulRestartEmbed = new EmbedBuilder()
      .setTitle("Redémarrage réussi!")
      .setDescription("Le bot a été redémarré avec succès.")
      .setFooter({
        text: `${messages.footerhelp}`,
        iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png",
      });

    interaction.editReply({ embeds: [successfulRestartEmbed] });
  },
};