const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");
const Logger = require("../.././Logger");
const messages = require("../../../messages.json");

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

        Logger.discordMessage(`${interaction.user.username} - [${interaction.commandName}]`);
        await command.execute(interaction);
      }
    } catch (error) {
      console.log(error);

      const errrorMessage =
        error instanceof HypixelDiscordChatBridgeError === false
          ? "Veuillez réessayer plus tard. L'erreur a été envoyée aux développeurs.\n\n"
          : "";
      const errorEmbed = new EmbedBuilder()
        .setAuthor({ name: "Une erreur est survenue" })
        .setDescription(`${errrorMessage}\`\`\`${error}\`\`\``)
        .setFooter({
            text: "FrenchLegacy",
            iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
        });

      await interaction.editReply({ embeds: [errorEmbed] });

      if (error instanceof HypixelDiscordChatBridgeError === false) {
        const errorLog = new EmbedBuilder()
          .setTitle("Erreur")
          .setDescription(
            `Commande: \`${interaction.commandName}\`\nOptions: \`${JSON.stringify(
              interaction.options.data
            )}\`\nUser ID: \`${interaction.user.id}\`\nUser: \`${
              interaction.user.username ?? interaction.user.tag
            }\`\n\`\`\`${error.stack}\`\`\``
          )
          .setFooter({
            text: `FrenchLegacy`,
            iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
          });

        interaction.client.channels.cache.get(config.discord.channels.loggingChannel).send({
          content: `<@&${config.discord.roles.commandRole}>`,
          embeds: [errorLog],
        });
      }
    }
  },
};
