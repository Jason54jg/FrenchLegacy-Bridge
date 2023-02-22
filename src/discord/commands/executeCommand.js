const config = require("../../../config.json");
// eslint-disable-next-line
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "execute",
  description: "Exécute les commandes en tant que bot minecraft.",
  options: [
    {
      name: "command",
      description: "Minecraft Command",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction, client) => {
    if ((await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.commandRole)) {
      const command = interaction.options.getString("command");
      bot.chat(`/${command}`);
      const commandMessage = new EmbedBuilder()
        .setColor(2067276)
        .setTitle("La commande a été exécutée avec succès")
        .setDescription(`\`/${command}\`\n`)
        .setFooter({
          iconURL: "https://media.discordapp.net/attachments/242779914330177536/1074676859788328992/fl_orange.png",
        });
      await interaction.followUp({ embeds: [commandMessage], ephemeral: true });
    } else {
      await interaction.followUp({
        content: "Vous n'êtes pas autorisé à exécuter cette commande.",
        ephemeral: true,
      });
    }
  },
};
