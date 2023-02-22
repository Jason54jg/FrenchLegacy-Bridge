const config = require("../../../config.json");

module.exports = {
  name: "blacklist",
  description: "Demotes the given user by one guild rank.",
  options: [
    {
      name: "arg",
      description: "Add or Remove",
      type: 3,
      required: true,
    },
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction, client) => {
    if ((await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.commandRole)) {
      const name = interaction.options.getString("name");
      const arg = interaction.options.getString("arg");

      if (arg.toLowerCase() == "add") {
        bot.chat(`/ignore add ${name}`);
        await interaction.followUp({
          content: "La commande a été exécutée avec succès.",
          ephemeral: true,
        });
      } else if (arg.toLowerCase() == "remove") {
        bot.chat(`/ignore remove ${name}`);
        await interaction.followUp({
          content: "La commande a été exécutée avec succès.",
          ephemeral: true,
        });
      } else {
        await interaction.followUp({
          content: "Utilisation invalide: `/ignore [add/remove] [name]`.",
          ephemeral: true,
        });
      }
    } else {
      await interaction.followUp({
        content: "Vous n'êtes pas autorisé à exécuter cette commande.",
        ephemeral: true,
      });
    }
  },
};
