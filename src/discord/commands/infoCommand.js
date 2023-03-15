const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");
const messages = require('../../../messages.json');

module.exports = {
  name: "info",
  description: "Affiche des informations sur le bot.",

  execute: async (interaction, client) => {
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
          value: `Bot Username: \`${bot.username}\`\nPrefix: \`${
            config.minecraft.bot.prefix
          }\`\nSkyBlock Events: \`${
            config.minecraft.skyblockEventsNotifications.enabled ? "enabled" : "disabled"
          }\`\nAcceptation automatique: \`${
            config.minecraft.guildRequirement.autoAccept ? "enabled" : "disabled"
          }\`\nExigence d'expérience de guilde: \`${config.minecraft.guild.guildExp.toLocaleString()}\`\nDisponibilité : En ligne depuis <t:${Math.floor(
            (Date.now() - client.uptime) / 1000
          )}:R>\nVersion: \`${require("../../../package.json").version}\`\n`,
          inline: true,
        },
        {
          name: `**Discord Information**`,
          value: `Guild Channel: ${
            config.discord.channels.guildChatChannel
              ? `<#${config.discord.channels.guildChatChannel}>`
              : "None"
          }\nOfficer Channel: ${
            config.discord.channels.officerChannel
              ? `<#${config.discord.channels.officerChannel}>`
              : "None"
          }\nGuild Logs Channel: ${
            config.discord.channels.loggingChannel
              ? `<#${config.discord.channels.loggingChannel}>`
              : "None"
          }\nDebugging Channel: ${
            config.discord.channels.debugChannel
              ? `<#${config.discord.channels.debugChannel}>`
              : "None"
          }\nCommande Role: <@&${
            config.discord.roles.commandRole
          }>\nMessage Mode: \`${
            config.discord.other.messageMode ? "enabled" : "disabled"
          }\`\nFilter: \`${config.discord.other.filterMessages}\`\nJoin Messages: \`${
            config.discord.other.joinMessage ? "enabled" : "disabled"
          }\``,
          inline: true,
        }
      )
      .setFooter({
        text: `${messages.footerhelp}`,
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });
    await interaction.reply({ embeds: [infoEmbed] });
  },
};

function getCommands(commands) {
  let discordCommands = "";
  commands.map((command) => {
    if (command.options !== undefined) {
      discordCommands += `- \`${command.name}`;
      command.options.map((option) => {
        if (option.required === true) {
          discordCommands += ` (${option.name})`;
        } else {
          discordCommands += ` [${option.name}]`;
        }
      });
      discordCommands += `\`\n`;
    } else {
      discordCommands += `- \`${command.name}\`\n`;
    }
  });

  let minecraftCommands = "";
  const minecraftCommandFiles = fs
    .readdirSync("./src/minecraft/commands")
    .filter((file) => file.endsWith(".js"));
  for (const file of minecraftCommandFiles) {
    const command = new (require(`../../minecraft/commands/${file}`))();

    minecraftCommands += `- \`${command.name}`;

    if (command.options !== undefined) {
      command.options.map((option) => {
        if (option.required === true) {
          minecraftCommands += ` (${option.name})`;
        } else {
          minecraftCommands += ` [${option.name}]`;
        }
      });
      minecraftCommands += `\`\n`;
    }
  }

  return { discordCommands, minecraftCommands };
}
