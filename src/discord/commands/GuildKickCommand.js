const config = require("../../../config.json");

module.exports = {
  name: "gkick",
  description: "Expulsez l'utilisateur donné de la guilde.",
  options: [
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
    {
      name: "raison",
      description: "Raison",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction, client) => {
    const name = interaction.options.getString("name");
    const reason = interaction.options.getString("raison");
    if (
      (await interaction.guild.members.fetch(interaction.user)).roles.cache.has(
        config.discord.roles.commandRole
      )
    ) {
      bot.chat(`/g kick ${name} ${reason}`);
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
