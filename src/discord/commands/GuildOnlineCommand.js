const { EmbedBuilder } = require("discord.js");
const messages = require("../../../messages.json");

module.exports = {
  name: "gonline",
  description: "Liste des membres en ligne.",

  execute: async (interaction) => {
    const cachedMessages = [];
    const messages = new Promise((resolve, reject) => {
      const listener = (message) => {
        message = message.toString();
        cachedMessages.push(message);
        if (message.startsWith("Offline Members")) {
          bot.removeListener("message", listener);
          resolve(cachedMessages);
        }
      };

      bot.on("message", listener);
      bot.chat("/g online");

      setTimeout(() => {
        bot.removeListener("message", listener);
        reject("La commande a expiré. Veuillez réessayer.");
      }, 12 * 5000);
    });

    try {
      const message = await messages;

      const onlineMembers = message.find((m) => m.startsWith("Online Members: "));
      const totalMembers = message.find((message) => message.startsWith("Total Members: "));

      const onlineMembersList = message;
      const online = onlineMembersList
        .flatMap((item, index) => {
          if (item.includes("-- ") === false) return;

          const nextLine = onlineMembersList[parseInt(index) + 1];
          if (nextLine.includes("●")) {
            const rank = item.replaceAll("--", "").trim();
            const players = nextLine
              .split("●")
              .map((item) => item.trim())
              .filter((item) => item);

            if (rank === undefined || players === undefined) return;

            return `**${rank}**\n${players.map((item) => `\`${item}\``).join(", ")}`;
          }
        })
        .filter((item) => item);

      const description = `${totalMembers}\n${onlineMembers}\n\n${online.join("\n")}`;
      const embed = new EmbedBuilder()
        .setColor("#2ECC71")
        .setTitle("Membres en ligne")
        .setDescription(description)
        .setFooter({
          text: `${messages.footerhelp}`,
          iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
        });

      return await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      const errorEmbed = new EmbedBuilder()
        .setColor("#E74C3C")
        .setTitle("Erreur")
        .setDescription(`\`\`\`${error}\`\`\``)
        .setFooter({
          text: `${messages.footerhelp}`,
          iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
        });

      return await interaction.followUp({ embeds: [errorEmbed] });
    }
  },
};
