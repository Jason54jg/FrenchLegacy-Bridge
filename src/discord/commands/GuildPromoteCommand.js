const config = require("../../../config.json");

module.exports = {
  name: "gpromote",
  description: "Promeut l'utilisateur donné d'un rang de guilde.",
  options: [
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction, client) => {
    const name = interaction.options.getString("name");
    if (
      (await interaction.guild.members.fetch(interaction.user)).roles.cache.has(
        config.discord.roles.commandRole
      )
    ) {
      bot.chat(`/g promote ${name}`);
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
