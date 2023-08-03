const { EmbedBuilder } = require("discord.js");
const messages = require("../../../messages.json");

module.exports = {
  name: "gtop",
  description: "Top 10 des membres avec le plus d'expérience de guilde.",
  options: [
    {
      name: "time",
      description: "Combien de jours à afficher",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction) => {
    const time = interaction.options.getString("time");

    const cachedMessages = [];
    const messages = new Promise((resolve, reject) => {
      const listener = (message) => {
        message = message.toString();
        cachedMessages.push(message);

        if (message.startsWith("10.") && message.endsWith("Guild Experience")) {
          bot.removeListener("message", listener);
          resolve(cachedMessages);
        }
      };

      bot.on("message", listener);
      bot.chat(`/g top ${time || ""}`);

      setTimeout(() => {
        bot.removeListener("message", listener);
        reject("La commande a expiré. Veuillez réessayer.");
      }, 5000);
    });

      const message = await messages;

      const trimmedMessages = message.map((message) => message.trim()).filter((message) => message.includes("."));
      const description = trimmedMessages
        .map((message) => {
          const [position, , name, guildExperience] = message.split(" ");
          return `\`${position}\` **${name}** - \`${guildExperience}\` Expérience de guilde\n`;
        })
        .join("");

      const embed = new EmbedBuilder()
        .setColor("#2ECC71")
        .setTitle("Top 10 des membres de la guilde")
        .setDescription(description)
        .setFooter({
          text: `${messages.footerhelp}`,
          iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
        });

      return await interaction.followUp({ embeds: [embed] });
  },
};
