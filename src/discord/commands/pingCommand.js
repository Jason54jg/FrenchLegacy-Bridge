// eslint-disable-next-line
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Affiche la latence du bot.",

  execute: async (interaction, client) => {
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("🏓 Pong!")
      .setDescription(`Latency: ${client.ws.ping}ms`)
      .setFooter({
        text: `/help [command] pour plus d'informations`,
        iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png",
      });

    interaction.followUp({ embeds: [embed] });
  },
};
