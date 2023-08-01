const config = require("../../../config.json");
const ms = require("ms");
const { toFixed } = require("../../contracts/helperFunctions.js");
const { EmbedBuilder } = require("discord.js");
const messages = require("../../../messages.json");

module.exports = {
  name: "ping",
  description: "Affiche la latence du bot.",

  execute: async (interaction) => {
    const clientLatency = Date.now() - interaction.createdTimestamp;
    const apiLatency = interaction.client.ws.ping;

    const embed = new EmbedBuilder()
      .setTitle("Ping!")
      .setDescription(`Latence client: \`${clientLatency}ms\`\nLatence de l'API: \`${apiLatency}ms\``)
      .setFooter({
        text: `${messages.footerhelp}`,
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });
    await interaction.followUp({ embeds: [embed] });
  },
};
