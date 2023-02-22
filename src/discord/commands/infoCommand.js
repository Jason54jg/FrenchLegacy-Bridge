const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "info",
  description: "Affiche des informations sur le bot.",

  execute: async (interaction, client) => {
    const commands = interaction.client.commands;

    const { discordCommands, minecraftCommands } = getCommands(commands);

    const infoEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Commandes du bot Hypixel Bridge")
      .addFields(
        {
          name: "**Minecraft Commands**: ",
          value: `${minecraftCommands}`,
          inline: true,
        },
        {
          name: "**Discord Commands**: ",
          value: `${discordCommands}`,
          inline: true,
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: "**Minecraft Information**:",
          value: `Bot Username: \`${bot.username}\`\nPrefix: \`${
            config.minecraft.prefix
          }\`\nAcceptation automatique: \`${
            config.guildRequirement.autoAccept ? "enabled" : "disabled"
          }\`\nExigence d'expérience de guilde: \`${config.minecraft.guildExp.toLocaleString()}\`\nDisponibilité : En ligne depuis <t:${Math.floor(
            (Date.now() - client.uptime) / 1000
          )}:R>\nVersion: \`${require("../../../package.json").version}\`\n`,
          inline: true,
        },
        {
          name: `**Discord Information**`,
          value: `Guild Channel: ${
            config.discord.guildChatChannel
              ? `<#${config.discord.guildChatChannel}>`
              : "None"
          }\nOfficer Channel: ${
            config.discord.officerChannel
              ? `<#${config.discord.officerChannel}>`
              : "None"
          }\nGuild Logs Channel: ${
            config.discord.loggingChannel
              ? `<#${config.discord.loggingChannel}>`
              : "None"
          }\nDebugging Channel: ${
            config.console.debugChannel
              ? `<#${config.console.debugChannel}>`
              : "None"
          }\nCommande Role: <@&${
            config.discord.roles.commandRole
          }>\nMessage Mode: \`${
            config.discord.messageMode ? "enabled" : "disabled"
          }\`\nFilter: \`${config.discord.filterMessages}\`\nJoin Messages: \`${
            config.discord.joinMessage ? "enabled" : "disabled"
          }\``,
          inline: true,
        }
      )
      .setFooter({
        text: "/help [commande] pour plus d'informations",
        iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png",
      });
    await interaction.followUp({ embeds: [infoEmbed] });
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
