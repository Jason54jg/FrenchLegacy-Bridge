const config = require("../../../config.json");
const messages = require("../../../messages.json");
const axios = require(`axios`);
const { addNotation, addCommas } = require("../../contracts/helperFunctions");

let messageId;

setInterval(banTracker, 30000);

async function banTracker() {
  try {
    const data = await axios.get(
      `https://api.hypixel.net/punishmentstats?key=${config.minecraft.API.hypixelAPIkey}`,
    );

    const channel = client.channels.cache.get(`1135185694906667140`);
    const embed1 = {
      title: `Un 🔨 Ban 🔨 sauvage est apparu !`,
      description: `(Cela devrait être mis à jour toutes les minutes)`,
      timestamp: new Date().toISOString(),
      fields: [
        {
          name: `Dernière(s) interdiction(s)`,
          value: `🚓\`${data.data.watchdog_lastMinute}\` Interdiction(s) de dernière minute`,
          inline: true,
        },
      ],
      footer: {
        text: `${messages.footerhelp}`,
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      },
    };

    if (messageId) {
      // Récupérer le message précédent et le supprimer
      const previousMessage = await channel.messages.fetch(messageId);
      if (previousMessage) {
        await previousMessage.delete();
      }
    }

    // Envoyer le message mis à jour et stocker son ID
    const sentMessage = await channel.send({ embeds: [embed1] });
    messageId = sentMessage.id;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { banTracker };
