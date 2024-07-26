const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
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

  execute: async (interaction) => {
    const commandName = interaction.options.getString("command") || undefined;

    if (commandName === undefined) {
      const discordCommands = interaction.client.commands
        .map(({ name, options }) => {
          const optionsString = options
            ?.map(({ name, required }) =>
              required ? ` (${name})` : ` [${name}]`,
            )
            .join("");
          return `- \`${name}${optionsString ? optionsString : ""}\`\n`;
        })
        .join("");

      const minecraftCommands = fs
        .readdirSync("./src/minecraft/commands")
        .filter((file) => file.endsWith(".js"))
        .map((file) => {
          const command = new (require(`../../minecraft/commands/${file}`))();
          const optionsString = command.options
            ?.map(({ name, required }) =>
              required ? ` (${name})` : ` [${name}]`,
            )
            .join("");

          return `- \`${command.name}${optionsString}\`\n`;
        })
        .join("");

      const helpMenu = new EmbedBuilder()
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
          },
        )
        .setFooter({
          text: `${messages.footerhelp}`,
          iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
        });

      await interaction.followUp({ embeds: [helpMenu] });
    } else {
      const minecraftCommand = fs
        .readdirSync("./src/minecraft/commands")
        .filter((file) => file.endsWith(".js"))
        .map((file) => new (require(`../../minecraft/commands/${file}`))())
        .find(
          (command) =>
            command.name === commandName ||
            command.aliases.includes(commandName),
        );

      const type = minecraftCommand ? "minecraft" : "discord";

      const command =
        interaction.client.commands.find(
          (command) => command.name === commandName,
        ) ?? minecraftCommand;
      if (command === undefined) {
        throw new HypixelDiscordChatBridgeError(
          `Commande ${commandName} introuvable.`,
        );
      }

      const description = `${
        command.aliases
          ? `\nAliases: ${command.aliases
              .map((aliase) => {
                return `\`${config.minecraft.bot.prefix}${aliase}\``;
              })
              .join(", ")}\n\n`
          : ""
      }${command.description}\n\n${
        command.options
          ?.map(({ name, required, description }) => {
            const optionString = required ? `(${name})` : `[${name}]`;
            return `\`${optionString}\`: ${description}\n`;
          })
          .join("") || ""
      }`;

      const embed = new EmbedBuilder()
        .setTitle(
          `**${type === "discord" ? "/" : config.minecraft.bot.prefix}${
            command.name
          }**`,
        )
        .setDescription(description + "\n")
        .setFooter({
          text: "() = obligatoire, [] = facultatif",
          iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
        });

      await interaction.followUp({ embeds: [embed] });
    }
  },
};
