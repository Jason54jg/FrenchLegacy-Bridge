const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "execute",
  description: "Exécute les commandes en tant que bot minecraft.",
  options: [
    {
      name: "commande",
      description: "Minecraft Command",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction, client) => {
    if (
      (await interaction.guild.members.fetch(interaction.user)).roles.cache.has(
        config.discord.roles.commandRole
      )
    ) {
      const command = interaction.options.getString("commande");
      bot.chat(`/${command}`);
      const commandMessage = new EmbedBuilder()
        .setColor(2067276)
        .setTitle("La commande a été exécutée avec succès")
        .setDescription(`\`/${command}\`\n`)
        .setFooter({
          iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png",
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
