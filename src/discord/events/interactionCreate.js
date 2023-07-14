const Logger = require("../.././Logger");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      // Pire idée au monde: impossible d'utiliser des réponses ephemeral
      // Si une interaction prend plus de 3 secondes a répondre, il faut
      // la gérer au niveau de la commande, pas de manière global

      // By doing this, you remove the ephemeral feature from EVERY command ever created
      //await interaction.deferReply({ ephemeral: false }).catch(() => {});

      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        Logger.discordMessage(
          `${interaction.user.username} - [${interaction.commandName}]`
        );

        bridgeChat = interaction.channelId;

        await command.execute(interaction, interaction.client);
      } catch (error) {
        console.log(error);

        await interaction.reply({
          content: `\`[⌛]\` ${interaction.member}, une erreur est survenue.`,
          ephemeral: true,
        });
      }
    }
  },
};
