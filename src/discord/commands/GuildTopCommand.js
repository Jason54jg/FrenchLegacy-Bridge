module.exports = {
  name: "guildtop",
  description: "Top 10 des membres avec le plus d'expérience de guilde.",
  options: [
    {
      name: "time",
      description: "Days Ago",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction, client) => {
    const time = interaction.options.getString("time");
    bot.chat(`/g top ${time ? time : ""}`);
    await interaction.followUp({
      content: "La commande a été exécutée avec succès.",
      ephemeral: true,
    });
  },
};
