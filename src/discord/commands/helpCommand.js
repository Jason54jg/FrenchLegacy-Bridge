// eslint-disable-next-line
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");
const messages = require("../../../messages.json");

module.exports = {
  name: "help",
  description: "Affiche le menu d'aide.",
  options: [
    {
      name: "command",
      description: "Obtenir des informations sur une commande spécifique",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction, client) => {
    const commandName = interaction.options.getString("command") || undefined;
    const commands = interaction.client.commands;

    if (commandName === undefined) {
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
      const helpMenu = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Hypixel Discord Bridge Bot Commandes")
        .setDescription("() = required argument, [] = optional argument")
        .addFields(
          {
            name: "**Minecraft**: ",
            value: `${minecraftCommands}`,
            inline: true,
          },
          {
            name: "**Discord**: ",
            value: `${discordCommands}`,
            inline: true,
          }
        )
        .setFooter({
          text: `${messages.footerhelp}`,
          iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
        });
      await interaction.reply({ embeds: [helpMenu] });
    } else {
      const minecraftCommand = fs
        .readdirSync("./src/minecraft/commands")
        .filter((file) => file.endsWith(".js"))
        .map((file) => new (require(`../../minecraft/commands/${file}`))())
        .find(
          (command) =>
            command.name === commandName ||
            command.aliases.includes(commandName)
        );
      const command =
        commands.find((command) => command.name === commandName) ||
        minecraftCommand;
      const type = commands.find((command) => command.name === commandName)
        ? "discord"
        : "minecraft";

      if (command === undefined) {
        const errorEmbed = new EmbedBuilder()
          .setColor("#ff0000")
          .setTitle("Erreur")
          .setDescription(`Command \`${commandName}\` was not found`)
          .setFooter({
            text: "() = obligatoire, [] = facultatif",
            iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
          });

        return await interaction.reply({ embeds: [errorEmbed] });
      }

      let description = "";
      description += `${command.description}\n\n`;
      if (command.options !== undefined) {
        description += `**Options**\n`;
        command.options.map((option) => {
          if (option.required === true) {
            description += `\`(${option.name})\`: ${option.description}\n`;
          } else {
            description += `\`[${option.name}]\`: ${option.description}\n`;
          }
        });
      }

      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(
          `**${type === "discord" ? "/" : config.minecraft.prefix}${
            command.name
          }**`
        )
        .setDescription(description + "\n")
        .setFooter({
          text: "() = obligatoire, [] = facultatif",
          iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
        });

      await interaction.reply({ embeds: [embed] });
    }
  },
};
