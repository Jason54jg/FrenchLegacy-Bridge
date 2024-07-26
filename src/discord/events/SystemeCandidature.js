const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const config = require("../../../config.json");
const Logger = require("../.././Logger.js");
const sourcebin = require("sourcebin_js");
const DB = require("../../../API/database/database.js");

const roles = config.discord.commands;
const disabledButtonCloseTicket = new ButtonBuilder()
  .setCustomId("ticket-fermer")
  .setLabel(" | fermer le ticket")
  .setEmoji("🔒")
  .setDisabled(true)
  .setStyle(ButtonStyle.Secondary);
const buttonCloseTicket = new ButtonBuilder()
  .setCustomId("ticket-fermer")
  .setLabel(" | fermer le ticket")
  .setEmoji("🔒")
  .setDisabled(false)
  .setStyle(ButtonStyle.Secondaryh);
const buttonConfirmerTicket = new ButtonBuilder()
  .setCustomId("confirmer")
  .setLabel(" | Confirmer")
  .setEmoji("📩")
  .setDisabled(false)
  .setStyle(ButtonStyle.Success);
const buttonRefuserTicket = new ButtonBuilder()
  .setCustomId("refuser")
  .setLabel(" | Refuser")
  .setEmoji("📩")
  .setDisabled(false)
  .setStyle(ButtonStyle.Danger);

module.exports = {
  name: "interactionCreate",
  once: false,
  execute: async (interaction, client) => {
    if (interaction.isModalSubmit()) {
      manageModalInteraction(interaction, client);
      return;
    }
    if (!interaction.isButton()) return;

    let catégoriecarry = roles.catégoriecarry;

    let roleStaff = interaction.guild.roles.cache.get(roles.staffRole);

    let DejaUnChannel = interaction.guild.channels.cache.find(
      (c) => c.topic == interaction.user.id,
    );

    if (interaction.customId.includes("ticket-fermer")) {
      const channel = interaction.channel;
      const member = interaction.guild.members.cache.get(channel.topic);
      const requestId = interaction.customId.split("-")[2];

      const rowPanel = new ActionRowBuilder().addComponents(buttonCloseTicket);

      await interaction.message.edit({ components: [rowPanel] });

      const rowDeleteFalse = new ActionRowBuilder().addComponents(
        disabledButtonCloseTicket,
      );

      const rowDeleteTrue = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setEmoji("🗑️")
          .setDisabled(false)
          .setCustomId(
            `ticket-supprimer${requestId != null ? `-${requestId}` : ""}`,
          ),
      );

      const embed = new EmbedBuilder()
        .setTitle("Fermer le ticket!")
        .setDescription(
          `ticket fermé par <@${interaction.user.id}>!\n\n**Appuyez sur le bouton 🗑️ pour supprimer le ticket!**`,
        );

      interaction
        .reply({ embeds: [embed], components: [rowDeleteFalse] })
        .then(() =>
          setTimeout(() => {
            interaction.channel.edit({
              name: `fermer-${
                member == undefined ? channel.topic : member.user.username
              }`,
            });
            interaction.editReply({ components: [rowDeleteTrue] });
          }, 2000),
        );

      if (member == undefined) {
        return;
      }
      interaction.channel.permissionOverwrites.edit(member, {
        ViewChannel: false,
      });
    } else if (interaction.customId.includes("candidature")) {
       const modal = new ModalBuilder()
         .setCustomId(interaction.customId.split("-")[1])
         .setTitle("N'oublie pas d'indiquer les bonnes infos");

       const levelInput = new TextInputBuilder()
         .setCustomId("lvlsb")
         .setLabel("Entre ton niveau skyblock")
         .setStyle(TextInputStyle.Short)
         .setMaxLength(4)
         .setMinLength(1)
         .setPlaceholder("Exemple: 230, 300, 350, ...")
         .setValue("230");
       const skycryptInput = new TextInputBuilder()
         .setCustomId("skycrypt")
         .setLabel("Entre le lien de ton skycrypt")
         .setStyle(TextInputStyle.Short)
         .setMaxLength(64)
         .setMinLength(1)
         .setPlaceholder("https://sky.shiiyu.moe/");

       const levelRow = new ActionRowBuilder().addComponents(levelInput);
       const skycryptRow = new ActionRowBuilder().addComponents(skycryptInput);
       modal.addComponents(levelRow, skycryptRow);
       await interaction.showModal(modal);
     } else if (interaction.customId === "confirmer") {
      // Verifie que ce n'est pas la personne à l'origine du ticket qui Confirmer
      if (
        interaction.message.mentions.users.keys().next().value ==
        interaction.user.id
      ) {
        return interaction.reply({
          embeds: [
            {
              description: `Vous ne pouvez pas confirmer votre propre ticket !`,
              footer: {
                text: "FrenchLegacy",
              },
            },
          ],
          ephemeral: true,
        });
      }

      // Vérifie que la personne qui Confirmer possède le role
      if (
        !interaction.member._roles.includes(
          interaction.message.content.split("&")[1].split(">")[0],
        )
      ) {
        return interaction.reply({
          embeds: [
            {
              description: `Vous ne possedez pas le rôle pour confirmer ce ticket !`,
              footer: {
                text: "FrenchLegacy",
              },
            },
          ],
          ephemeral: true,
        });
      }

      // Envoyer la réponse
      interaction.reply({
        embeds: [
          {
            description: `Votre Candidature a été accepter par ${interaction.user}`,
            footer: {
              text: "FrenchLegacy",
            },
          },
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("ticket-fermer")
              .setLabel(" | Candidature effectué")
              .setEmoji("🔒")
              .setStyle(ButtonStyle.Success),
          ),
        ],
      });
      // Désactiver le bouton de Confirmer
      interaction.message.edit({
        components: [
          new ActionRowBuilder().addComponents(
            buttonCloseTicket,
            buttonConfirmerTicket.setDisabled(true),
          ),
        ],
      });
      // Désactiver le bouton de Refuser
      interaction.message.edit({
        components: [
          new ActionRowBuilder().addComponents(
            buttonCloseTicket,
            buttonRefuserTicket.setDisabled(true),
          ),
        ],
      });
    } else if (
      interaction.customId.includes("ticket-supprimer") &&
      interaction.channel.name.includes("fermer")
    ) {
      closeTicket(interaction, interaction.customId.split("-")[2]);
    }
  },
};

async function manageModalInteraction(interaction, client) {
  // Candidature interactions
  if (interaction.customId == "v1") {
    createCandidatureChannel(
      interaction,
      "v1",
      roles.staffRole,
      roles.catégoriecarry,
    );
  } else if (interaction.customId == "v2") {
    createCandidatureChannel(
      interaction,
      "v2",
      roles.staffRole,
      roles.catégoriecarry,
    );
  }
}

function createCandidatureChannel(
  interaction,
  title,
  roleId,
  categorieId,
) {
  const roleStaff = interaction.guild.roles.cache.get(
    config.discord.commands.staffRole,
  );
  const role = interaction.guild.roles.cache.get(roleId);

  const level = interaction.fields.getTextInputValue("lvlsb");
  const skycryptlink = interaction.fields.getTextInputValue("skycrypt");

  // Si la valeur renseigné n'est pas un nombre valide
  if (isNaN(level) || level < 1) {
    return interaction.reply({
      embeds: [
        {
          description: `Vous devez renseigner un nombre valide afin de pouvoir créer ce ticket`,
          footer: {
            text: "FrenchLegacy",
          },
        },
      ],
      ephemeral: true,
    });
  }

  // Création du channel de candidature
  interaction.guild.channels
    .create({
      name: `${title} ${interaction.user.username}`,
      type: ChannelType.GuildText,
      topic: `${interaction.user.id}`,
      parent: `${categorieId}`,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.SendMessages,
          ],
        },
        {
          id: roleStaff,
          allow: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: role,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.SendMessages,
          ],
        },
      ],
    })

    // Envoie des informations sur les candidature dans le nouveau channel
    .then((c) => {
      c.send({
        content: `${role} | ${interaction.user} \nLevel ${level} Skyblock \n${skycryptlink}`,
        components: [
          new ActionRowBuilder().addComponents(
            buttonCloseTicket,
            buttonConfirmerTicket.setDisabled(false),
            buttonRefuserTicket.setDisabled(false),
          ),
        ],
      });
      interaction.reply({
        content: `Votre ticket à été ouvert avec succès. <#${c.id}>`,
        ephemeral: true,
      });
    });
}

async function closeTicket(interaction, ticketType = null) {
  const channel = interaction.channel;

  const logChannelCandidatureService = roles.logChannelCandidatureService;

  let transcriptsChannel;
  switch (ticketType) {
    case "candidature":
    case "candidaturerequest":
      transcriptsChannel = interaction.guild.channels.cache.get(
        logChannelCandidatureService,
      );
      break;
    default:
      transcriptsChannel = interaction.guild.channels.cache.get(
        logChannelCandidatureService,
      );
  }

  let msg = await channel.send({ content: "Enregistrement du transcript..." });
  channel.messages.fetch().then(async (messages) => {
    const content = messages
      .reverse()
      .map(
        (m) =>
          `${new Date(m.createdAt).toLocaleString("en-US")} - ${
            m.author.tag
          }: ${
            m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content
          }`,
      )
      .join("\n");

    let transcript = await sourcebin.create(
      [{ name: `${channel.name}`, content: content, languageId: "text" }],
      {
        title: `Transcript: ${channel.name}`,
        description: " ",
      },
    );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setEmoji("📑")
        .setURL(`${transcript.url}`),
    );

    const embed = new EmbedBuilder().setTitle("Ticket Transcript").addFields(
      { name: "Channel", value: `${interaction.channel.name}`, inline: true },
      {
        name: "Propriétaire du ticket",
        value: `<@${channel.topic}>`,
        inline: true,
      },
      {
        name: "Supprimé par",
        value: `<@${interaction.user.id}>`,
        inline: true,
      },
      {
        name: "Direct Transcript",
        value: `[Direct Transcript](${transcript.url})`,
        inline: true,
      },
    );

    await transcriptsChannel.send({ embeds: [embed], components: [row] });
  });

  await msg.edit({
    content: `Transcript enregistrée dans <#${transcriptsChannel.id}>`,
  });

  await channel.send({ content: "Le ticket sera supprimé dans 5 secondes!" });

  setTimeout(async function () {
    channel.delete();
  }, 5000);
}
