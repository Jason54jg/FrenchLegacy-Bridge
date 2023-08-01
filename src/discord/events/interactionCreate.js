const { EmbedBuilder } = require("discord.js");
const Logger = require("../.././Logger");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        await interaction.deferReply({ ephemeral: false }).catch(() => {});

        const command = interaction.client.commands.get(interaction.commandName);
        if (command === undefined) {
          return;
        }

        bridgeChat = interaction.channelId;

        Logger.discordMessage(`${interaction.user.username} - [${interaction.commandName}]`);
        await command.execute(interaction, interaction.client);
      }
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setAuthor({ name: "Une erreur est survenue" })
        .setDescription(`\`\`\`${error}\`\`\``)
        .setFooter({
            text: "FrenchLegacy",
            iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
        });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
