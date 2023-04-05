const { EmbedBuilder } = require("discord.js");
const messages = require('../../../messages.json');

module.exports = {
    name: "guildtop",
    description: "Top 10 des membres avec le plus d'expérience de guilde.",
    options: [
        {
            name: "time",
            description: "Combien de jours à afficher",
            type: 3,
            required: false,
        },
    ],

    execute: async (interaction, client) => {
        const time = interaction.options.getString("time");

        const cachedMessages = [];
        const promise = new Promise((resolve, reject) => {
            const listener = (message) => {
                cachedMessages.push(message.toString());

                if (
                    message.toString().startsWith("10.") &&
                    message.toString().endsWith("Guild Experience")
                ) {
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

        try {
            const messages = await promise;
            const trimmedMessages = messages
                .map((message) => message.trim())
                .filter((message) => message.includes("Guild Experience"));

            const description = trimmedMessages.map(
                (message) => {
                    if (trimmedMessages.indexOf(message) === 0) return;

                    const [position, , name, guildExperience] = message.split(" ");
                    return `\`${position}\` **${name}** - \`${guildExperience}\` Expérience de guilde\n`
                }
            ).join("");

            const embed = new EmbedBuilder()
                .setColor("#2ECC71")
                .setTitle("Top 10 des membres de la guilde")
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
