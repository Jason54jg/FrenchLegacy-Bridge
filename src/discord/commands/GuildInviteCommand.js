const config = require("../../../config.json");

module.exports = {
  name: "ginvite",
  description: "Invite l'utilisateur dans la guilde.",
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
      bot.chat(`/g invite ${name}`);
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
