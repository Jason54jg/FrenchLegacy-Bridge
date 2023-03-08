const config = require("../../../config.json");

module.exports = {
    name: "blacklist",
    description: "Blacklist un utilisateur",
    options: [
        {
            name: "arg",
            description: "Ajouter ou retirer",
            type: 3,
            required: true,
        },
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
        const arg = interaction.options.getString("arg");

        if (arg.toLowerCase() == "add") {
            bot.chat(`/ignore add ${name}`);
            await interaction.reply({
                content: "La commande a été exécutée avec succès.",
                ephemeral: true,
            });
        } else if (arg.toLowerCase() == "remove") {
            bot.chat(`/ignore remove ${name}`);
            await interaction.reply({
                content: "La commande a été exécutée avec succès.",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: "Utilisation invalide: `/blacklist [add/remove] [name]`.",
                ephemeral: true,
            });
        }

    },
};
