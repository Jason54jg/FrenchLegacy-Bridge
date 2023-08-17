const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { toFixed } = require("../../contracts/helperFunctions.js");
const config = require("../../../config.json");
const DB = require("../../../API/database/database.js");

module.exports = {
  name: "giveaway",
  description: "Créer un Giveway.",
  options: [
    {
      name: "nom",
      description: "Nom du giveway (prix a gagner)",
      type: 3,
      required: true,
    },
    {
      name: "host",
      description: "Host du giveaway",
      type: 6,
      required: true,
    },
    {
      name: "gagnant",
      description: "Nombre de personnes pouvant gagner le giveaway",
      type: 4,
      required: true,
    },
    {
      name: "date_de_fin",
      description:
        "Date du tirage au format JJ/MM/AAAA:HH:mm (ex: 01/12/2022:12:30)",
      type: 3,
      required: true,
    },
    {
      name: "require",
      description: "Seul les personnes ayant le role renseigné pourrons participer au giveaway",
      type: 8,
      required: false
    }
  ],

  execute: async (interaction) => {
    const user = interaction.member;
    if (user.roles.cache.has(config.discord.roles.adminRole) === false) {
      throw new HypixelDiscordChatBridgeError("Vous n'êtes pas autorisé à utiliser cette commande.");
    }


    const name = interaction.options.get("nom").value;
    const channel = interaction.channelId;
    const host = interaction.options.get("host").value;
    const winners = interaction.options.get("gagnant").value;
    const date = interaction.options.get("date_de_fin").value;
    const roleRequired = interaction.options.get("require").value;

    // Vérifier si la date renseignée est valide
    if (date.match(/(\d{2}\/){2}\d{4}(:\d{2}){2}/g).length == 0) {
      return await interaction.followUp({
        content: "La date renseignée n'est pas valide",
        ephemeral: true,
      });
    }

    // Créer la vrai date
    const d = date.split("/");
    const h = d[2].split(":");
    const dateFormatted = new Date(
      Date.UTC(h[0], d[1] - 1, d[0], h[1] - 1, h[2])
    );

    // Préparation du giveaway
    let giveawayId = await DB.createGiveaway(
      name,
      channel,
      dateFormatted,
      host,
      winners,
      roleRequired
    );

    if (giveawayId == null) {
      return await interaction.followUp({
        content:
          "Une erreur est survenue lors de l'interaction avec la base de donnée",
        ephemeral: true,
      });
    }
    giveawayId = giveawayId.insertedId.toHexString();

    // Préparation de l'embed du giveaway
    const giveawayEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(
        `Giveaway - ${name} - ${winners} Gagnant${winners > 1 ? "s" : ""}`
      )
      .setDescription(
        `Merci à <@${host}> qui organise ce giveaway !\n\n` +
          `${roleRequired != null ? `Ce giveaway est reservé aux personnes qui possède le role <@&${roleRequired}>\n` : ``}`
          `Vous avez jusqu'au <t:${
            dateFormatted.valueOf() / 1000
          }> pour y participer\n` +
          `Fin <t:${+toFixed(dateFormatted / 1000, 0)}:R>`
      )
      .setFooter({
        text: "FrenchLegacy",
        iconURL:
          "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png",
      });
    interaction.followUp({
      embeds: [giveawayEmbed],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`giveaway_${giveawayId}`)
            .setLabel("0 Participants")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`giveaway_${giveawayId}_list`)
            .setLabel("Liste des participants")
            .setStyle(ButtonStyle.Secondary)
        ),
      ],
    });
  },
};
