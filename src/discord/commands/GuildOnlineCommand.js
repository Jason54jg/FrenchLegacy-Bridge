const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "gonline",
  description: "Liste des membres en ligne.",

  execute: async (interaction, client) => {
    const cachedMessages = [];
    const promise = new Promise((resolve, reject) => {
      const listener = (message) => {
        cachedMessages.push(message.toString());

        if (message.toString().startsWith("Membres hors ligne")) {
          bot.removeListener("message", listener);
          resolve(cachedMessages);
        }
      };

      bot.on("message", listener);
      bot.chat("/g online");

      setTimeout(() => {
        bot.removeListener("message", listener);
        reject("La commande a expiré. Veuillez réessayer.");
      }, 5000);
    });

    try {
      const messages = await promise;
      const trimmedMessages = messages.map(message => message.trim());

      let offlineMembers = messages.find((message) =>
        message.startsWith("Membres hors ligne: ")
      );
      offlineMembers =
        offlineMembers.split(": ")[0] +
        ": " +
        `\`${offlineMembers.split(": ")[1]}\``;

      const onlineMembersMessage = trimmedMessages.find(message => message.startsWith("Membres en ligne: "));
      const onlineMembers = `${onlineMembersMessage.split(": ")[0]}: \`${onlineMembersMessage.split(": ")[1]}\``;

      const offlineMembersMessage = trimmedMessages.find(message => message.startsWith("Membres hors ligne: "));
      const offlineMembers = `${offlineMembersMessage.split(": ")[0]}: \`${offlineMembersMessage.split(": ")[1]}\``;

      const totalMembersMessage = trimmedMessages.find(message => message.startsWith("Nombre total de membres: "));
      const totalMembers = `${totalMembersMessage.split(": ")[0]}: \`${totalMembersMessage.split(": ")[1]}\``;

      const onlineMembersList = trimmedMessages;

      let description = `\n${onlineMembers}\n${offlineMembers}\n${totalMembers}\n\n**ONLINE**`;

      let online = onlineMembersList.flatMap((item, index) => {
        if (item.includes("-- ")) {
          const nextLine = onlineMembersList[parseInt(index) + 1];
          if (nextLine && nextLine.includes("●")) {
            return nextLine.split("●").map(item => item.trim());
          }
        }
        return [];
      });

      online = online.filter(item => item);
      description += online.map(item => `\`${item}\``).join(", ");

      const embed = new EmbedBuilder()
        .setColor("#2ECC71")
        .setTitle("Membres en ligne")
        .setDescription(description)
        .setFooter({
          text: "/help [commande] pour plus d'informations",
          iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png",
        });

      return await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      const errorEmbed = new EmbedBuilder()
        .setColor("#E74C3C")
        .setTitle("Erreur")
        .setDescription(`\`\`\`${error}\`\`\``)
        .setFooter({
          text: "/help [commande] pour plus d'informations",
          iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png",
        });

      return await interaction.followUp({ embeds: [errorEmbed] });
    }
  },
};
