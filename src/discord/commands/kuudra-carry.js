const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const config = require("../../../config.json");
const messages = require("../../../messages.json");

module.exports = {
  name: "kuudracarry",
  description: `Commande pour les embeds des kuudra`,

  execute: async (interaction) => {
    const user = interaction.member;
    if (
      config.discord.commands.checkPerms === true &&
      !(user.roles.cache.has(config.discord.commands.adminRole) || config.discord.commands.users.includes(user.id))
    ) {
      throw new HypixelDiscordChatBridgeError("Vous n'êtes pas autorisé à utiliser cette commande.");
    }

    const terms = new EmbedBuilder()
      .addFields(
        {
          name: "Termes et conditions",
          value:
            "**1)** Dans les 30 minutes suivant l'ouverture d'un ticket, veuillez indiquer votre IGN et le nombre de runs que vous souhaitez.\n**2)** Ne faites pas de ticket de service si vous n'êtes pas prêt à le recevoir.\n**3)** Le paiement est effectué d'avance, sans exception.\n**4)** Une fois que vous entrez dans le kuudra, la classe que vous choisissez dépend du carrier afin qu'il puisse vous proposer un carry plus efficace.\n**5)** Votre carry est considéré comme terminé lorsque le carry se termine et que vous obtenez le score que vous avez commandé.\n**6)** Tout le butin que vous recevez est entièrement à vous.",
        },
        {
          name: "__**Remarques**__",
          value:
            "Vous pouvez être averti si vous ouvrez un ticket et n'y envoyez pas de message pendant 30 minutes. Vous pouvez recevoir un avertissement si vous ne donner pas de réponse pendant plus d'un jour. Si vous êtes averti plus de 5 fois vous recevrez une liste noir de tickets.",
        }
      )
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const kuudra1 = new EmbedBuilder()
      .setAuthor({
        name: "Kuudra Basic Tier",
        iconURL: "https://cdn.discordapp.com/emojis/1049723395740274709.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/1049723395740274709.png")
      .addFields({ name: "Runs", value: "- 1 Run: 5m\n- 5 ou plus: 4m/unité" })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const kuudra2 = new EmbedBuilder()
      .setAuthor({
        name: "Kuudra Hot Tier",
        iconURL: "https://cdn.discordapp.com/emojis/1049723395740274709.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/1049723395740274709.png")
      .addFields({ name: "Runs", value: "- 1 Run: 9m\n- 5 ou plus: 7m/unité" })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const kuudra3 = new EmbedBuilder()
      .setAuthor({
        name: "Kuudra Burning Tier",
        iconURL: "https://cdn.discordapp.com/emojis/1049723395740274709.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/1049723395740274709.png")
      .addFields({
        name: "Runs",
        value: "- 1 Run: 13m\n- 5 ou plus: 10m/unité",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const kuudra4 = new EmbedBuilder()
      .setAuthor({
        name: "Kuudra Fiery Tier",
        iconURL: "https://cdn.discordapp.com/emojis/1049723395740274709.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/1049723395740274709.png")
      .addFields({
        name: "Runs",
        value: "- 1 Run: 18m\n- 5 ou plus: 15m/unité",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const kuudra5 = new EmbedBuilder()
      .setAuthor({
        name: "Kuudra Infernal Tier",
        iconURL: "https://cdn.discordapp.com/emojis/1049723395740274709.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/1049723395740274709.png")
      .addFields({
        name: "Runs",
        value: "- 1 Run: 40m\n- 5 ou plus: 30m/unité",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const conditions = new EmbedBuilder()
      .setTitle("Conditions d'entrée")
      .setDescription(
        "Veuillez vous assurer que vous remplissez les conditions d'entrée lors de la création d'un ticket. Les conditions d'entrée sont les suivantes:"
      )
      .addFields({
        name: "▬▬▬▬▬▬▬▬",
        value:
          "Kuudra Basic Tier nécessite l'achèvement de la quête\nKuudra Hot Tier nécessite 1,000 de reputation\nKuudra Burning Tier nécessite 3,000 de reputation\nKuudra Fiery Tier nécessite 7,000 de reputation\n\nRemarque : l'achèvement des niveaux précédents est requis pour entrer dans le niveau pour lequel vous achetez un carry.",
        inline: true,
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const service = new EmbedBuilder()
      .addFields({
        name: "Services de carry kuudra",
        value:
          "<:Kuudra:1049723395740274709>: Kuudra Basic Tier\n<:Kuudra:1049723395740274709>: Kuudra Hot Tier\n<:Kuudra:1049723395740274709>: Kuudra Burning Tier\n<:Kuudra:1049723395740274709>: Kuudra Fiery Tier\n<:Kuudra:1049723395740274709>: Kuudra Infernal Tier\n\n(Ce sont les prix des carrys publics, les membres de la guilde auront une réduction de 30% sur le prix de base)",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    interaction.channel.send({
      embeds: [
        terms,
        conditions,
        kuudra1,
        kuudra2,
        kuudra3,
        kuudra4,
        kuudra5,
        service,
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("carry-k1")
            .setLabel("Basic")
            .setEmoji("1049723395740274709")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-k2")
            .setLabel("Hot")
            .setEmoji("1049723395740274709")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-k3")
            .setLabel("Burning")
            .setEmoji("1049723395740274709")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-k4")
            .setLabel("Fiery")
            .setEmoji("1049723395740274709")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-k5")
            .setLabel("Infernal")
            .setEmoji("1049723395740274709")
            .setStyle(ButtonStyle.Primary)
        ),
      ],
    });
  },
};
