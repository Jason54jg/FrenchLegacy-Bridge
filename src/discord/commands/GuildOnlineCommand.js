const { EmbedBuilder } = require("discord.js");
const messages = require("../../../messages.json");

module.exports = {
  name: "gonline",
  description: "Liste des membres en ligne.",

  execute: async (interaction, client) => {
    const cachedMessages = [];
    const promise = new Promise((resolve, reject) => {
      const listener = (message) => {
        cachedMessages.push(message.toString());
        if (message.toString().startsWith("Offline Members")) {
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
      const messages = await promise;
      const trimmedMessages = messages.map((message) => message.trim());

      const onlineMembersMessage = trimmedMessages.find((message) =>
        message.startsWith("Online Members: ")
      );
      const onlineMembers = `${onlineMembersMessage.split(": ")[0]}: \`${
        onlineMembersMessage.split(": ")[1]
      }\``;

      const totalMembersMessage = trimmedMessages.find((message) =>
        message.startsWith("Total Members: ")
      );
      const totalMembers = `${totalMembersMessage.split(": ")[0]}: \`${
        totalMembersMessage.split(": ")[1]
      }\``;

      const onlineMembersList = trimmedMessages;

      let description = `${totalMembers}\n${onlineMembers}\n\n`;

      let online = onlineMembersList.flatMap((item, index) => {
        if (item.includes("-- ")) {
          const nextLine = onlineMembersList[parseInt(index) + 1];
          if (nextLine?.includes("●")) {
            return [item, nextLine.split("●").map((item) => item.trim())];
          }
        }
        return [];
      });

      online = online.filter((item) => item);

      description += online
        .map((item) => {
          if (item.length === 0) return;

          if (item.includes("--")) {
            item = item.replaceAll("--", "").trim();
            return `**${item}**\n`;
          } else {
            return `\`${item.filter((item) => item !== "").join(", ")}\`\n`;
          }
        })
        .join(" ");

      const embed = new EmbedBuilder()
        .setColor("#2ECC71")
        .setTitle("Membres en ligne")
        .setDescription(description)
        .setFooter({
          text: `${messages.footerhelp}`,
          iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
        });

      return await interaction.reply({ embeds: [embed] });
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

      return await interaction.reply({ embeds: [errorEmbed] });
    }
  },
};
