const config = require("../../../config.json");
const messages = require('../../../messages.json');

module.exports = {
    name: "gkick",
    description: "Expulsez l'utilisateur donné de la guilde.",
    options: [
        {
            name: "name",
            description: "Pseudo Minecraft",
            type: 3,
            required: true,
        },
        {
            name: "raison",
            description: "Raison",
            type: 3,
            required: true,
        },
    ],

    execute: async (interaction, client) => {
        // Si l'utilisateur n'a pas la permission d'utiliser la commande
        if (!(await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole)) {
            return await interaction.reply({
                content: `${messages.permissionInsuffisante}`,
                ephemeral: true,
            });
        }

        const name = interaction.options.getString("name");
        const reason = interaction.options.getString("raison");

        bot.chat(`/g kick ${name} ${reason}`);
        await interaction.reply({
            content: `${messages.commandeRéussi}`,
            ephemeral: true,
        });
    },
};
