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
  name: "floorcarry",
  description: `Commande pour les embeds de floor`,

  execute: async (interaction) => {
    const user = interaction.member;
    if (config.discord.commands.checkPerms === true && user.roles.cache.has(config.discord.commands.adminRole) === false) {
      throw new HypixelDiscordChatBridgeError("Vous n'êtes pas autorisé à utiliser cette commande.");
    }

    const terms = new EmbedBuilder()
      .addFields(
        {
          name: "Termes et conditions",
          value:
            "**1)** Dans les 30 minutes suivant l'ouverture d'un ticket, veuillez indiquer votre IGN et le nombre de runs que vous souhaitez ainsi que le score.\n**2)** Ne faites pas un ticket de carry si vous n'êtes pas prêt à le recevoir.\n**3)** Le paiement est effectué d'avance, sans exception.\n**4)** Si vous mourez plus de 2 fois et que le score est inférieur à celui que vous avez commandé, nous ne sommes pas obligés de compenser votre perte.\n**5)** Si vous vous déconnectez pendant le carry, le carrier tentera de vous warp. Si vous n'êtes pas en mesure de revenir, vous avez 48 heures pour réclamer les coins, sinon elles appartiendront au carrier.\n**6)** Une fois que vous entrez dans le donjon, la classe que vous choisissez dépend du carrier afin qu'il puisse vous proposer un carry plus efficace.\n**7)** Votre carry est considéré comme terminé lorsque le carry se termine et que vous obtenez le score que vous avez commandé.\n**8)** Tout le butin que vous recevez est entièrement à vous.",
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

    const floor1 = new EmbedBuilder()
      .setAuthor({
        name: "Floor 1",
        iconURL: "https://cdn.discordapp.com/emojis/1039705817252909147.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/1039705817252909147.png")
      .addFields(
        {
          name: "Completion",
          value: "- 1 Run: 90k\n- 5 ou plus: 70k/unité",
          inline: true,
        },
        {
          name: "S Runs",
          value: "- 1 Run: 120k\n- 5 ou plus: 100k/unité",
          inline: true,
        }
      )
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const floor2 = new EmbedBuilder()
      .setAuthor({
        name: "Floor 2",
        iconURL: "https://cdn.discordapp.com/emojis/1039705859518910634.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/1039705859518910634.png")
      .addFields(
        {
          name: "Completion",
          value: "- 1 Run: 170k\n- 5 ou plus: 150k/unité",
          inline: true,
        },
        {
          name: "S Runs",
          value: "- 1 Run: 250k\n- 5 ou plus: 210k/unité",
          inline: true,
        }
      )
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const floor3 = new EmbedBuilder()
      .setAuthor({
        name: "Floor 3",
        iconURL: "https://cdn.discordapp.com/emojis/1039705994768425050.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/1039705994768425050.png")
      .addFields(
        {
          name: "Completion",
          value: "- 1 Run: 280k\n- 5 ou plus: 260k/unité",
          inline: true,
        },
        {
          name: "S Runs",
          value: "- 1 Run: 350k\n- 5 ou plus: 300k/unité",
          inline: true,
        }
      )
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const floor4 = new EmbedBuilder()
      .setAuthor({
        name: "Floor 4",
        iconURL: "https://cdn.discordapp.com/emojis/759298333608378388.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/759298333608378388.png")
      .addFields(
        {
          name: "Completion",
          value: "- 1 Run: 400k\n- 5 ou plus: 340k/unité",
          inline: true,
        },
        {
          name: "S Runs",
          value: "- 1 Run: 600k\n- 5 ou plus: 510k/unité",
          inline: true,
        }
      )
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const floor5 = new EmbedBuilder()
      .setAuthor({
        name: "Floor 5",
        iconURL: "https://cdn.discordapp.com/emojis/759298251068801044.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/759298251068801044.png")
      .addFields(
        {
          name: "Completion",
          value: "- 1 Run: 350k\n- 5 ou plus: 300k/unité",
          inline: true,
        },
        {
          name: "S Runs",
          value: "- 1 Run: 500k\n- 5 or more Runs: 425k/unité",
          inline: true,
        },
        {
          name: "S+ Runs",
          value: "- 1 Run: 800k\n- 5 ou plus: 680k/unité",
          inline: true,
        }
      )
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const floor6 = new EmbedBuilder()
      .setAuthor({
        name: "Floor 6",
        iconURL: "https://cdn.discordapp.com/emojis/761951536829825035.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/761951536829825035.png")
      .addFields(
        {
          name: "Completion",
          value: "- 1 Run: 600k\n- 5 ou plus: 510k/unité",
          inline: true,
        },
        {
          name: "S Runs",
          value: "- 1 Run: 850k\n- 5 ou plus: 725k/unité",
          inline: true,
        },
        {
          name: "S+ Runs",
          value: "- 1 Run: 1.1m\n- 5 ou plus: 850k/unité",
          inline: true,
        }
      )
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const floor7 = new EmbedBuilder()
      .setAuthor({
        name: "Floor 7",
        iconURL: "https://cdn.discordapp.com/emojis/833916984886427678.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/833916984886427678.png")
      .addFields(
        {
          name: "Completion",
          value: "- 1 Run: 4m\n- 5 ou plus: 3.4m/unité",
          inline: true,
        },
        {
          name: "S Runs",
          value: "- 1 Run: 8m\n- 5 ou plus: 6.8m/unité",
          inline: true,
        },
        {
          name: "S+ Runs",
          value: "- 1 Run: 10m\n- 5 ou plus: 8.5m/unité",
          inline: true,
        }
      )
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
          "L'étage 1 nécessite Catacombes niveau 1\nL'étage 2 nécessite Catacombes niveau 3\nL'étage 3 nécessite Catacombes niveau 5\nL'étage 4 nécessite Catacombes niveau 9\nL'étage 5 nécessite Catacombes niveau 14\nL'étage 6 nécessite Catacombes niveau 19\nL'étage 7 nécessite Catacombes niveau 24",
        inline: true,
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const service = new EmbedBuilder()
      .addFields({
        name: "Services de carry donjon",
        value:
          "<:Bonzo:1039705817252909147>: Floor 1\n<:Scarf:1039705859518910634>: Floor 2\n<:Professor:1039705994768425050>: Floor 3\n<:Thorn:1039692699625865276>: Floor 4\n<:Livid:1039692626665934900>: Floor 5\n<:Sadan:1039692739488534580>: Floor 6\n<:Necron:1040832502417338458>: Floor 7\n\n(Ce sont les prix des carrys publics, les membres de la guilde auront une réduction de 30% sur le prix de base)",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    interaction.channel.send({
      embeds: [
        terms,
        conditions,
        floor1,
        floor2,
        floor3,
        floor4,
        floor5,
        floor6,
        floor7,
        service,
      ],
      components: [
        // 1ere ligne de buttons (5 max)
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("carry-f1")
            .setLabel("F1")
            .setEmoji("1039705817252909147")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-f2")
            .setLabel("F2")
            .setEmoji("1039705859518910634")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-f3")
            .setLabel("F3")
            .setEmoji("1039705994768425050")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-f4")
            .setLabel("F4")
            .setEmoji("1039692699625865276")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-f5")
            .setLabel("F5")
            .setEmoji("1039692626665934900")
            .setStyle(ButtonStyle.Primary)
        ),
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("carry-f6")
            .setLabel("F6")
            .setEmoji("1039692739488534580")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-f7")
            .setLabel("F7")
            .setEmoji("1040832502417338458")
            .setStyle(ButtonStyle.Primary)
        ),
        // 2eme ligne de buttons (5 max)
        /*new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('f8')
                        .setLabel('F8')
                        .setEmoji('1040832502417338458')
                        .setStyle(ButtonStyle.Primary),
                    )
                // etc
                */
      ],
    });
  },
};
