const util = require("../../../API/functions/getguildlist");
const { EmbedBuilder } = require("discord.js");

module.exports = { updateRosterEmbed };

async function updateRosterEmbed(guild) {
  const guildInfo = await util.guild_list(guild);

  const fields = [];
  guildInfo.ranks.forEach((rank) => {
    let membersValues = [];
    let membersValue = "";
    let rankSize = 0;

    // Regrouper chaque joueurs par rank
    guildInfo.memberInfo.forEach((member) => {
      if (member.rank != rank.name) {
        return;
      }

      let newPlayer = `\`\`${member.name} ${member.online ? "✔️" : "❌"}\`\` `;

      // Si le field fait + de 1024 car, il faut créér un nouveau field
      if ((membersValue + newPlayer).length > 1024) {
        membersValues.push(membersValue);
        membersValue = "";
      }

      membersValue += newPlayer;
      rankSize++;
    });
    membersValues.push(membersValue);

    // Préparer le(s) field(s) de l'embed pour le rank
    for (let i = 0; i < membersValues.length; i++) {
      fields.push({
        name: `${
          i == 0
            ? `${rank.name} ${
                rank.tag != null ? `[${rank.tag}]` : ""
              } » ${rankSize}`
            : "\u200b"
        }`,
        value: `\u200b${membersValues[i]}`,
      });
    }
  });

  const embed = new EmbedBuilder()
    .setTitle(`Membres de la guilde ${guild}`)
    .setDescription(
      `Nombre de membres de la guilde : **${guildInfo.memberInfo.length}/125**`,
    )
    .addFields(fields);
  return embed;
}
