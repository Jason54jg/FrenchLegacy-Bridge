const config = require("../../../config.json");
const messages = require("../../../messages.json");
const axios = require(`axios`);
const { addNotation, addCommas } = require("../../contracts/helperFunctions");

let messageSent = false;
let messageId;

setInterval(banTracker, 30000);

async function banTracker() {
  try {
    const data = await axios.get(
      `https://api.hypixel.net/punishmentstats?key=${config.minecraft.API.hypixelAPIkey}`,
    );

    const channel = client.channels.cache.get(`1135185694906667140`);
    const embed1 = {
      title: `🔨 Statistiques d'interdiction d'Hypixel 🔨`,
      description: `Les statistiques d'interdiction d'Hypixel sont mises à jour toutes les 10 secondes`,
      timestamp: new Date().toISOString(),
      fields: [
        {
          name: `🔨 Statistiques totales🔨`,
          value: `🚓 **Staff Total**: ${addCommas(
            data.data.staff_total,
          )}\n🐕 **Watchdog Total**: ${addCommas(data.data.watchdog_total)}`,
        },
        {
          name: `🔃 Statistiques des interdictions quotidiennes en continu 🔃`,
          value: `🚓 **Staff**: ${addCommas(
            data.data.staff_rollingDaily,
          )}\n🐕 **Watchdog**: ${addCommas(data.data.watchdog_rollingDaily)}`,
          inline: true,
        },
      ],
      footer: {
        text: `${messages.footerhelp}`,
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      },
    };

    if (messageSent) {
      // Modifier le message existant
      await channel.messages.fetch(messageId).then((msg) => {
        msg.edit({ embeds: [embed1] });
      });
    } else {
      // Envoyer un nouveau message
      await channel.send({ embeds: [embed1] }).then((msg) => {
        messageId = msg.id;
        messageSent = true;
      });
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { banTracker };
