const { EmbedBuilder } = require("discord.js");
const { toFixed } = require("../../contracts/helperFunctions.js");

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage) {
    if (oldMessage.author.bot) return;

    const embed = new EmbedBuilder()
      .setDescription( `**Message modifié dans ${oldMessage.channel} [Message](${oldMessage.url})**`)
      .addFields(
        { name: "→ Avant", value: oldMessage.content, inline: false },
        { name: "→ Maintenant", value: newMessage.content, inline: false },
        { name: `→ Temps: <t:${+ toFixed((Date.now() + client.uptime) / 1000, 0)}:R>`, value: '\u200B', inline: false }
      )

    const channel = oldMessage.guild.channels.cache.get("1084756237675147304");

    channel.send({ embeds: [embed] });
  },
};