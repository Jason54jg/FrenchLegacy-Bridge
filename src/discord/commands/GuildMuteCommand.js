const config = require("../../../config.json");

module.exports = {
  name: "gmute",
  description: "Mute un utilisateur donné pendant une durée donnée.",
  options: [
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
    {
      name: "temps",
      description: "Temps",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction, client) => {
    const name = interaction.options.getString("name");
    const time = interaction.options.getString("temps");
    if (
      (await interaction.guild.members.fetch(interaction.user)).roles.cache.has(
        config.discord.roles.commandRole
      )
    ) {
      bot.chat(`/g mute ${name} ${time}`);
      await interaction.followUp({
        content: "La commande a été exécutée avec succès.",
        ephemeral: true,
      });
    } else {
      await interaction.followUp({
        content: "Vous n'êtes pas autorisé à exécuter cette commande.",
        ephemeral: true,
      });
    }
  },
};
