const config = require("../../../config.json");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const pointLb = require("../fonction_pour_bot/point-leaderboard");
const DB = require("../../../API/database/database.js");

module.exports = {
  name: "interactionCreate",
  once: false,
  execute: async (interaction, client) => {
    if (interaction.isButton()) {
      // Commande: points-leaderboard
      if (interaction.customId.includes("lb-points-")) {
        return await managePointsLeaderboardButton(interaction);
      }

      // Commande: giveaway
      if (interaction.customId.includes("giveaway_")) {
        return await manageGiveawayButtons(interaction);
      }

      // Info giveaway
      if (interaction.customId.includes("giveawayWinInfo")) {
        return await interaction.reply({
          content:
            "Pour pouvoir recevoir ta récompense tu devras faire un ticket -> <#999022746619084961> et ping l'host du giveaway",
          ephemeral: true,
        });
        }

      // Gestion de la fin d'un giveaway
      if(interaction.customId.includes("giveawayWinManage_")) {
          const user = interaction.member;
          if (user.roles.cache.has(config.discord.roles.adminRole) === false) {
              return await interaction.reply({
                  content: "Vous n'êtes pas autorisé à utiliser ce bouton",
                  ephemeral: true,
              });
          }
          return await displayGiveawayEndManagement(interaction);
          //return await manageEndGiveaway(interaction);
      }

      // Relancer un giveaway
      if(interaction.customId.includes("giveawayReroll_")) {
          return await rerollGiveaway(interaction);
      }
        
      // Terminer un giveaway
      if(interaction.customId.includes("giveawayEnd_")) {
          return await endGiveaway(interaction);
      }
    }
  },
};

async function managePointsLeaderboardButton(interaction) {
  // Un bouton de l'interaction a été cliqué: on change de page du leaderboard
  const pageSelected = parseInt(interaction.customId.split("-")[2], 10);
  const lbres = await pointLb.createPointLeaderboardPage(pageSelected);

  if (lbres == null) {
    return await interaction.reply({
      content:
        "Une erreur est survenue lors de l'exécution de la requête vers la base de données.",
      ephemeral: true,
    });
  }

  return interaction.update({ embeds: lbres[0], components: lbres[1] });
}

async function manageGiveawayButtons(interaction) {
  const id = interaction.customId.split("_");
  const giveawayId = id[1];

  const giveaway = await DB.getGiveaway(giveawayId);
  if (giveaway == null) {
    return await interaction.reply({
      content:
        "Vous ne pouvez plus intéragir avec ce giveaway car il est terminé !",
      ephemeral: true,
    });
  }
  const participants = [...new Set(giveaway.participants)];

  // Determiné quel bouton a été cliqué
  if (id.length > 2) {
    // Afficher la liste des participants du giveaway
    let description = "";
    let isFull = false;
    for (let i = 0; i < participants.length && !isFull; i++) {
      const user = participants[i];

      const currentUserFormatted = `<@${user}> `;
      const fillerMessage = `\net ${participants.length - (i + 1)} autres...`;

      description += currentUserFormatted;
      if (description.length > 4070 - fillerMessage.length) {
        // max description length = 4096 - default description message - filler message
        description = description.substring(
          0,
          description.length - 1 - currentUserFormatted.length,
        );
        description += fillerMessage;
        isFull = true;
      }
    }

    const embed = new EmbedBuilder()
      .setTitle(`Participants au giveaway **${giveaway.name}**`)
      .setDescription(
        `Total: ${participants.length} participants \n${description}`,
      );

    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  } else {
    // Participer au giveaway
    const user = interaction.user.id;

    // Si l'utilisateur s'est déjà inscrit
    if (await DB.isUserParticipatingToGiveaway(giveawayId, user)) {
      return await interaction.reply({
        content: "Vous êtes déjà inscrit à ce giveaway",
        ephemeral: true,
      });
    }
    // Vérifier que l'utilisateur peut participer au giveaway
    if (
      giveaway.roleRequired != null &&
      !interaction.member.roles.cache.has(giveaway.roleRequired)
    ) {
      return await interaction.reply({
        content: `Vous ne pouvez pas participer à ce giveaway car il vous manque le rôle <@&${giveaway.roleRequired}>`,
        ephemeral: true,
      });
    }

    // Ajouter l'utilisateur au giveaway
    DB.registerUserToGiveaway(giveawayId, user);

    // Update des boutons
    let newActionRowEmbeds = interaction.message.components.map(
      (oldActionRow) => {
        updatedActionRow = new ActionRowBuilder();
        updatedActionRow.addComponents(
          oldActionRow.components.map((buttonComponent) => {
            newButton = ButtonBuilder.from(buttonComponent);
            if (buttonComponent.customId.split("_").length == 2) {
              newButton.setLabel(
                `${participants.length + 1} Participant${
                  participants.length != 1 ? "s" : ""
                }`,
              );
            }
            return newButton;
          }),
        );
        return updatedActionRow;
      },
    );
    await interaction.update({ components: newActionRowEmbeds });

    // Envoie de la confirmation
    return interaction.followUp({
      content: `Votre participation au giveaway **${giveaway.name}** a été prise en compte`,
      ephemeral: true,
    });
  }
}

async function displayGiveawayEndManagement(interaction) {
    const id = interaction.customId.split("_");
    const giveawayId = id[1];


    const giveaway = await DB.getGiveaway(giveawayId);
    if (giveaway == null) {
        return await interaction.reply({
            content:
                "Vous ne pouvez plus intéragir avec ce giveaway car il est terminé !",
            ephemeral: true,
        });
    }

    const embed = new EmbedBuilder()
        .setTitle(`Gestion de la fin du giveaway **${giveaway.name}**`)
        .setDescription("Pensez a bien cliquer sur Terminer pour supprimer ce giveaway");

    return await interaction.reply({
        embeds: [embed],
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`giveawayReroll_${giveawayId}`)
                    .setLabel(`Relancer un tirage`)
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`giveawayEnd_${giveawayId}`)
                    .setLabel(`Terminer`)
                    .setStyle(ButtonStyle.Danger)
            ),
        ],
        ephemeral: true
    });
}

async function rerollGiveaway(interaction) {
    const id = interaction.customId.split("_");
    const giveawayId = id[1];

    const giveaway = await DB.getGiveaway(giveawayId);
    if (giveaway == null) {
        return await interaction.reply({
            content:
                "Vous ne pouvez plus intéragir avec ce giveaway car il est terminé !",
            ephemeral: true,
        });
    }

    // Prévenir qu'un reroll va être effectué
    const giveawayChannel = client.channels.cache.get(
        giveaway.channel
    );

    const embed = new EmbedBuilder()
        .setTitle(`Le giveaway **${giveaway.name}** va être relancé`)
        .setDescription(
            `Un administrateur a relancé les résultats du giveaway`
        );

    giveawayChannel.send({
        embeds: [embed],
    });

    // Changer le statut d'attente du giveaway
    DB.setGiveawayRerollStatus(giveaway._id, false);

    return await interaction.reply({
        content:
            "Les nouveaux résultats sont en cours de calcul...",
        ephemeral: true,
    });
}
async function endGiveaway(interaction) {
    const id = interaction.customId.split("_");
    const giveawayId = id[1];

    const giveaway = await DB.getGiveaway(giveawayId);
    if (giveaway == null) {
        return await interaction.reply({
            content:
                "Vous ne pouvez plus intéragir avec ce giveaway car il est terminé !",
            ephemeral: true,
        });
    }

    // Supprimer le giveaway de la DB
    DB.deleteGiveaway(giveaway._id);

    return await interaction.reply({
        content:
            "Vous avez mis fin à ce giveaway",
        ephemeral: true,
    });
}