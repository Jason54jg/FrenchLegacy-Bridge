const { EmbedBuilder } = require("discord.js");
const { toFixed } = require("../../contracts/helperFunctions.js");

module.exports = {
  name: "messageDelete",
  async execute(message) {
    if (message.author.bot) return;

    const embed = new EmbedBuilder().setDescription(
      `Message envoyé par ${message.author} supprimé dans ${
        message.channel
      }\n**→ Temps:** <t:${+toFixed(
        (Date.now() + client.uptime) / 1000,
        0,
      )}:R>\n**→ message:** ${message.content}`,
    );

    const channel = message.guild.channels.cache.get("1084756237675147304");

    channel.send({ embeds: [embed] });
  },
};
