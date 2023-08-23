const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");
const messages = require("../../../messages.json");

module.exports = {
  name: "info",
  description: "Affiche des informations sur le bot.",

  execute: async (interaction) => {
    const commands = interaction.client.commands;

    const { discordCommands, minecraftCommands } = getCommands(commands);

    const infoEmbed = new EmbedBuilder()
      .setTitle("Commandes du bot French Legacy")
      .addFields(
        {
          name: "**Minecraft Commandes**: ",
          value: `${minecraftCommands}`,
          inline: true,
        },
        {
          name: "**Discord Commandes**: ",
          value: `${discordCommands}`,
          inline: true,
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: "**Minecraft Information**:",
          value: `Bot Username: \`${bot.username}\`\nPrefix: \`${config.minecraft.bot.prefix}\`\nSkyBlock Events: \`${
            config.minecraft.skyblockEventsNotifications.enabled ? "enabled" : "disabled"
          }\`\nGuild Experience Requirement: \`${config.minecraft.guild.guildExp.toLocaleString()}\`\nUptime: Online since <t:${Math.floor(
            (Date.now() - client.uptime) / 1000
          )}:R>\nVersion: \`${require("../../../package.json").version}\`\n`,
          inline: true,
        },
        {
          name: `**Discord Information**`,
          value: `Guild Channel: ${
            config.discord.channels.guildChatChannel ? `<#${config.discord.channels.guildChatChannel}>` : "None"
          }\nOfficer Channel: ${
            config.discord.channels.officerChannel ? `<#${config.discord.channels.officerChannel}>` : "None"
          }\nGuild Logs Channel: ${
            config.discord.channels.loggingChannel ? `<#${config.discord.channels.loggingChannel}>` : "None"
          }\nDebugging Channel: ${
            config.discord.channels.debugChannel ? `<#${config.discord.channels.debugChannel}>` : "None"
          }\nCommand Role: <@&${config.discord.commands.staffRole}>\nMessage Mode: \`${
            config.discord.other.messageMode
          }\`\nFilter: \`${config.discord.other.filterMessages ? "enabled" : "disabled"}\`\nJoin Messages: \`${
            config.discord.other.joinMessage ? "enabled" : "disabled"
          }\``,
          inline: true,
        }
      )
      .setFooter({
        text: `${messages.footerhelp}`,
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });
    await interaction.followUp({ embeds: [infoEmbed] });
  },
};

function getCommands(commands) {
  const discordCommands = commands
    .map(({ name, options }) => {
      const optionsString = options?.map(({ name, required }) => (required ? ` (${name})` : ` [${name}]`)).join("");
      return `- \`${name}${optionsString ? optionsString : ""}\`\n`;
    })
    .join("");

  const minecraftCommands = fs
    .readdirSync("./src/minecraft/commands")
    .filter((file) => file.endsWith(".js"))
    .map((file) => {
      const command = new (require(`../../minecraft/commands/${file}`))();
      const optionsString = command.options
        ?.map(({ name, required }) => (required ? ` (${name})` : ` [${name}]`))
        .join("");

      return `- \`${command.name}${optionsString}\`\n`;
    })
    .join("");

  return { discordCommands, minecraftCommands };
}