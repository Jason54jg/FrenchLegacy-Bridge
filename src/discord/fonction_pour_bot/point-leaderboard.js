const DB = require("../../../API/database/database.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = { createPointLeaderboardPage };

const userPerPage = 20;

async function createPointLeaderboardPage(currentPage) {
  let description = "";

  const res = await DB.getUserByScoreOrder(currentPage, userPerPage);
  if (res == null || res.length === 0) {
    return;
  }

  // Affichage en pagination car les embeds ne supportent que 4080 caracteres / descriptions
  const userPageIndex = userPerPage * currentPage;
  const components = new ActionRowBuilder();

  // Ajout de la page previous si ce n'est pas la première page
  if (currentPage != 1) {
    components.addComponents(
      new ButtonBuilder()
        .setCustomId(`lb-points-${currentPage - 1}`)
        .setLabel("◀️")
        .setStyle(ButtonStyle.Primary)
    );
  }

  // Ajout de la page next si il reste des utilisateurs a afficher
  if (res.length == userPerPage) {
    components.addComponents(
      new ButtonBuilder()
        .setCustomId(`lb-points-${currentPage + 1}`)
        .setLabel("▶️")
        .setStyle(ButtonStyle.Primary)
    );
  }

  // Mise en place de la description
  for (let i = 0; i < res.length; i++) {
    description += `${i + userPageIndex - userPerPage + 1}. <@${
      res[i].discordId
    }>: ${res[i].score} points\n`;
  }
  description = description.substring(0, description.length - 1);

  // Envoie du leaderboard
  let msg = [
    // Embed
    [
      {
        title: `Leaderboard de points`,
        description: description,
        footer: {
          text: "FrenchLegacy",
          icon_url:
            "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png",
        },
      },
    ],
  ];
  // Button
  if (components.components.length !== 0) {
    msg.push([components]);
  }

  return msg;
}
