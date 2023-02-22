module.exports = {
  name: "online",
  description: "List of online members.",

  execute: async (interaction, client) => {
    bot.chat(`/g online`);
    await interaction.followUp({
      content: "La commande a été exécutée avec succès.",
      ephemeral: true,
    });
  },
};
