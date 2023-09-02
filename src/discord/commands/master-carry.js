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
  name: "mastercarry",
  description: `Commande pour les embeds de master`,

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
            "**1)** Dans les 30 minutes suivant l'ouverture d'un ticket, veuillez indiquer votre IGN et le nombre de runs que vous souhaitez.\n**2)** Ne faites pas de ticket de service si vous n'êtes pas prêt à le recevoir.\n**3)** Le paiement est effectué d'avance, sans exception.\n**4)** Si vous mourez plus de 2 fois et que le score est inférieur à celui que vous avez commandé, nous ne sommes pas obligés de compenser votre perte.\n**5)** Si vous vous déconnectez pendant le carry en master mode étage 7 phase 5, vous ne serez pas remboursé, sinon vous serez remboursé pour tous les autres étages.\n**6)** Une fois que vous entrez dans le donjon, la classe que vous choisissez dépend du carrier afin qu'il puisse vous proposer un carry plus efficace.\n**7)** Votre carry est considéré comme terminé lorsque le carry se termine et que vous obtenez le score que vous avez commandé.\n**8)** Tout le butin que vous recevez est entièrement à vous.",
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

    const master1 = new EmbedBuilder()
      .setAuthor({
        name: "Master 1",
        iconURL: "https://cdn.discordapp.com/emojis/839241812672512021.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/839241812672512021.png")
      .addFields({
        name: "S Runs",
        value: "- 1 Run: 1m\n- 5 ou plus: 850k/unité",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const master2 = new EmbedBuilder()
      .setAuthor({
        name: "Master 2",
        iconURL: "https://cdn.discordapp.com/emojis/839242380066291772.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/839242380066291772.png")
      .addFields({
        name: "S Runs",
        value: "- 1 Run: 2m\n- 5 ou plus: 1.7m/unité",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const master3 = new EmbedBuilder()
      .setAuthor({
        name: "Master 3",
        iconURL: "https://cdn.discordapp.com/emojis/839242407614087240.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/839242407614087240.png")
      .addFields({
        name: "S Runs",
        value: "- 1 Run: 3m\n- 5 ou plus: 2m/unité",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const master4 = new EmbedBuilder()
      .setAuthor({
        name: "Master 4",
        iconURL: "https://cdn.discordapp.com/emojis/759298333608378388.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/759298333608378388.png")
      .addFields({ name: "Completion", value: "- 1 Run: 10m" })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const master5 = new EmbedBuilder()
      .setAuthor({
        name: "Master 5",
        iconURL: "https://cdn.discordapp.com/emojis/759298251068801044.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/759298251068801044.png")
      .addFields({
        name: "S Runs",
        value: "- 1 Run: 4m\n- 5 ou plus: 3.6m/unité",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const master6 = new EmbedBuilder()
      .setAuthor({
        name: "Master 6",
        iconURL: "https://cdn.discordapp.com/emojis/761951536829825035.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/761951536829825035.png")
      .addFields({
        name: "S Runs",
        value: "- 1 Run: 6m\n- 5 ou plus: 5.1m/unité",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const master7 = new EmbedBuilder()
      .setAuthor({
        name: "Master 7",
        iconURL: "https://cdn.discordapp.com/emojis/833916984886427678.png",
      })
      .setThumbnail("https://cdn.discordapp.com/emojis/833916984886427678.png")
      .addFields({
        name: "S Runs",
        value: "- 1 Run: 25m\n- 5 ou plus: 21m unité",
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
          "Master 1 nécessite Catacombes niveau 24\nMaster 2 nécessite Catacombes niveau 26\nMaster 3 nécessite Catacombes niveau 28\nMaster 4 nécessite Catacombes niveau 30\nMaster 5 nécessite Catacombes niveau 32\nMaster 6 nécessite Catacombes niveau 34\nMaster 7 nécessite Catacombes niveau 36\n\nRemarque : l'achèvement des étages précédents est requis pour entrer dans l'étage pour lequel vous achetez un carry.",
        inline: true,
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const service = new EmbedBuilder()
      .addFields({
        name: "Services de carry donjon (Master Mode)",
        value:
          "<:Bonzo:1039705817252909147>: Master 1\n<:Scarf:1039705859518910634>: Master 2\n<:Professor:1039705994768425050>: Master 3\n<:Bonzo:1039692699625865276>: Master 4\n<:Livid:1039692626665934900>: Master 5\n<:Sadan:1039692739488534580>: Master 6\n<:Necron:1040832502417338458>: Master 7\n\n(Ce sont les prix des carrys publics, les membres de la guilde auront une réduction de 30% sur le prix de base)",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    interaction.channel.send({
      embeds: [
        terms,
        conditions,
        master1,
        master2,
        master3,
        master4,
        master5,
        master6,
        master7,
        service,
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("carry-m1")
            .setLabel("M1")
            .setEmoji("1039705817252909147")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-m2")
            .setLabel("M2")
            .setEmoji("1039705859518910634")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-m3")
            .setLabel("M3")
            .setEmoji("1039705994768425050")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-m4")
            .setLabel("M4")
            .setEmoji("1039692699625865276")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-m5")
            .setLabel("M5")
            .setEmoji("1039692626665934900")
            .setStyle(ButtonStyle.Primary)
        ),
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("carry-m6")
            .setLabel("M6")
            .setEmoji("1039692739488534580")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-m7")
            .setLabel("M7")
            .setEmoji("1040832502417338458")
            .setStyle(ButtonStyle.Primary)
        ),
      ],
    });
  },
};
