const config = require("../../../config.json");

module.exports = {
    name: "ginvite",
    description: "Invite l'utilisateur dans la guilde.",
    options: [
        {
            name: "name",
            description: "Minecraft Username",
            type: 3,
            required: true,
        },
    ],

    execute: async (interaction, client) => {
        // Si l'utilisateur n'a pas la permission d'utiliser la commande
        if (!(await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole)) {
            return await interaction.reply({
                content: "Vous n'êtes pas autorisé à exécuter cette commande.",
                ephemeral: true,
            });
        }
        const name = interaction.options.getString("name");
        bot.chat(`/g invite ${name}`);
        await interaction.reply({
            content: "La commande a été exécutée avec succès.",
            ephemeral: true,
        });
    },
};
