const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const config = require("./../../../config.json");
const { EmbedBuilder } = require("discord.js");
const app = require("./../../Application.js");

module.exports = {
  name: "restart",
  description: "Restarts the bot.",

  execute: async (interaction) => {
    if (
      config.discord.commands.checkPerms === true &&
      interaction.member.roles.cache.has(config.discord.commands.commandRole) === false
    ) {
      throw new HypixelDiscordChatBridgeError("You do not have permission to use this command.");
    }

    const restartEmbed = new EmbedBuilder()
      .setColor(15548997)
      .setTitle("Restarting...")
      .setDescription("The bot is restarting. This may take a few seconds.")
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    interaction.followUp({ embeds: [restartEmbed] });

    await bot.end("restart");
    await client.destroy();

    app.register().then(() => {
      app.connect();
    });

    const successfulRestartEmbed = new EmbedBuilder()
      .setColor(2067276)
      .setTitle("Restart Successful!")
      .setDescription("The bot has been restarted successfully.")
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    interaction.editReply({ embeds: [successfulRestartEmbed] });
  },
};