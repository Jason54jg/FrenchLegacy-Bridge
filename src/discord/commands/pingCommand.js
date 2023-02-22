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
        iconURL: "https://media.discordapp.net/attachments/242779914330177536/1074676859788328992/fl_orange.png",
      });

    interaction.followUp({ embeds: [embed] });
  },
};
