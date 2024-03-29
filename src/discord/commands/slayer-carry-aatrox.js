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
  name: "slayercarryaatrox",
  description: `Commande pour les embeds de slayer`,

  execute: async (interaction) => {
    const user = interaction.member;
    if (
      config.discord.commands.checkPerms === true &&
      !(
        user.roles.cache.has(config.discord.commands.adminRole) ||
        config.discord.commands.users.includes(user.id)
      )
    ) {
      throw new HypixelDiscordChatBridgeError(
        "Vous n'êtes pas autorisé à utiliser cette commande.",
      );
    }

    const rev = new EmbedBuilder()
      .setDescription("# Prix des Zombie")
      .setThumbnail("https://cdn.discordapp.com/emojis/884973282615500870.png")
      .addFields({
        name: "\u200b",
        value:
          "Zombie T4: 180k/unité\nPrix pour (10 ou plus) : 96k/unité\n\nZombie T5: 240k/unité\nPrix pour (10 ou plus) : 180k/unité",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const wolf = new EmbedBuilder()
      .setDescription("# Prix des Wolf")
      .setThumbnail("https://cdn.discordapp.com/emojis/1134075444392640573.png")
      .addFields({
        name: "\u200b",
        value: "Wolf T4: 100k/unité\nPrix pour (10 ou plus) : 80k/unité",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const spider = new EmbedBuilder()
      .setDescription("# Prix des Spider")
      .setThumbnail("https://cdn.discordapp.com/emojis/1081243964755157012.png")
      .addFields({
        name: "\u200b",
        value:
          "Spider T3: 84k/unité\nPrix pour (10 ou plus) : 60k/unité\n\nSpider T4: 120k/unité\nPrix pour (10 ou plus) : 108k/unité",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const enderman = new EmbedBuilder()
      .setDescription("# Prix des Enderman")
      .setThumbnail("https://cdn.discordapp.com/emojis/862880360529395752.png")
      .addFields({
        name: "\u200b",
        value:
          "Voidgloom Seraph 3: 960k/unité\nPrix pour (10 ou plus) : 720k/unité\n\nVoidgloom Seraph 4: 3m/unité\nPrix pour (10 ou plus) : 2.4m/unité",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const inferno = new EmbedBuilder()
      .setDescription("# Prix des Inferno")
      .setThumbnail("https://cdn.discordapp.com/emojis/1039705790501617745.png")
      .addFields({
        name: "\u200b",
        value:
          "Inferno Demonlord 2: 1.2m/unité\nPrix pour (10 ou plus) : 1m/unité\n\nInferno Demonlord 3: 3m/unité\nPrix pour (10 ou plus) : 2.4m/unité\n\nInferno Demonlord 4: 7.8m/unité\nPrix pour (10 ou plus) : 7.2m/unité",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const important = new EmbedBuilder()
      .setDescription("## ⚠️ Informations importantes pour les clients ⚠️")
      .addFields({
        name: "\u200b",
        value:
          "- Pour les carry en gros, veillez à ne pas payer plus de 25m à la fois. Si votre transporteur vous met la pression pour payer plus que ce montant, veuillez créer un ticket dans <#999022746619084961> et les signaler.\n- Tous les services de slayer nécessitent au moins 25 de combat.\n- Si votre carrier fait du RCM à vos slayer, veuillez créer un ticket de support et les signaler en conséquence. Nous n'autorisons pas les carry RCM Eman.\n\nRemarque :\n- Il est plus pratique pour vous d'être proche du spawn de votre boss avant de créer un ticket. Cela vous fait gagner un peu de temps à vous et au carrier.\n\n**❗ Il peut y avoir de longs temps d'attente pour les carry de blaze depuis que l'armure de Sorrow a été nerfée.**",
        inline: true,
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const terms = new EmbedBuilder()
      .setDescription("# Termes et conditions")
      .addFields(
        {
          name: "\u200b",
          value:
            "**1)** Dans les 30 minutes suivant l'ouverture d'un ticket, veuillez indiquer votre IGN, le type de slayer que vous voulez, le nombre de boss que vous voulez et le niveau de boss que vous voulez passer.\n**2)** Ne créez pas de ticket de service si vous n'êtes pas prêt à le recevoir.\n**3)** Tenter d'escroquer les carrier de slayer entraînera un bannissement.\n**4)** Le paiement est effectué d'avance.\n**5)** Vous devez être Combat 25 pour utiliser ce service.\n**6)** Si vous mourez à cause de vos propres erreurs, les carrier n'ont pas à refaire le boss pour vous. Votre carrier doit vous expliquer les règles très clairement.\n**7)** Tout le butin que vous obtenez du boss est à VOUS. Cela vaut également si vous obtenez des objets exceptionnellement rares.\n**8)** Votre carry est terminé lorsque vous recevez l'expérience du slayer suite à la mort du boss.\n**9)**  Les prix indiqués ne sont pas négociables, toute tentative de sous-enchère entraînera un avertissement.",
        },
        {
          name: "__**Remarques**__",
          value:
            "- Vous serez averti si vous enfreignez l'une des règles ci-dessus.\n- Vous serez averti si vous ouvrez un ticket et n'y envoyez pas de message pendant 30 minutes.\n- Si vous êtes averti plus de 5 fois vous recevrez une liste noire de tickets.",
        },
      )
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const carry = new EmbedBuilder()
      .addFields({
        name: "Service de carry Slayer",
        value:
          "<:Blaze:1039705790501617745>: Service de carry Inferno Demonlord\n<:Enderman:1039706047214014464>: Service de carry des void seraph\n<:Revenant:1039706422465794158>: Service de carry revenant horror\n<:Spider:1081243964755157012>: Service de carry Spider\n\n(Ce sont les prix des carrys publics, les membres de la guilde auront une réduction de 30% sur le prix de base)",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    const aatrox = new EmbedBuilder()
      .setDescription("# Services de carry slayer")
      .addFields({
        name: "\u200b",
        value:
          "Exceptionnellement nous avons augmenté les prix des carrys pendant Aatrox de 20%",
      })
      .setFooter({
        text: "FrenchLegacy",
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });

    interaction.channel.send({
      embeds: [
        terms,
        rev,
        spider,
        wolf,
        enderman,
        inferno,
        carry,
        important,
      ],
      components: [
        // Ligne 1
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("carry-T3Spider")
            .setLabel("T3 Spider")
            .setEmoji("1081243964755157012")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-T4Spider")
            .setLabel("T4 Spider")
            .setEmoji("1081243964755157012")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-T4Wolf")
            .setLabel("T4 Wolf")
            .setEmoji("1134075444392640573")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-T4REV")
            .setLabel("T4 Revenant")
            .setEmoji("1039706422465794158")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-T5REV")
            .setLabel("T5 Revenant")
            .setEmoji("1039706422465794158")
            .setStyle(ButtonStyle.Primary),
        ),
        // Créer une nouvelle ligne tout les 5 boutons !
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("carry-T3eman")
            .setLabel("T3 Enderman")
            .setEmoji("1039706047214014464")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-T4eman")
            .setLabel("T4 Enderman")
            .setEmoji("1039706047214014464")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-T2blaze")
            .setLabel("T2 Blaze")
            .setEmoji("1039705790501617745")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-T3blaze")
            .setLabel("T3 Blaze")
            .setEmoji("1039705790501617745")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("carry-T4blaze")
            .setLabel("T4 Blaze")
            .setEmoji("1039705790501617745")
            .setStyle(ButtonStyle.Primary),
        ),
      ],
    });
  },
};
