const { default: axios } = require('axios');
const messages = require('../../../messages.json');


module.exports = {
    name: 'testkey',
    description: 'teste une clé api hypixel',
    options: [
        {
            name: 'key',
            description: 'la clé api hypixel à tester',
            type: 3,
            required: true
        },


      ],
    execute: async (interaction, client, InteractionCreate) => {
        let key = interaction.options.getString("key")

        const response = await axios.get(`https://api.hypixel.net/key?key=${key}`);
        const data = response.data.record;
        const keye = data.key;
        const owner = data.owner;
        const limit = data.limit;
        const queriesInPastMin = data.queriesInPastMin;
        const totalQueries = data.totalQueries;
        const username = (await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${owner}/`)).data.name

        const chat = {
            title: `Data de la clé`,
            description: (`Clé Hypixel entrée: || ${keye} ||\nUUID du propriétaire de la clé: **${owner}**\nNom d'utilisateur du propriétaire de la clé: **${username}**\nLimite de clé: \`${limit}\`\nRequêtes au cours de la dernière minute: **${queriesInPastMin}**\nRequêtes totales: **${totalQueries}**`),
            timestamp: new Date().toISOString(),
            footer: {text: `${messages.footerhelp}`, iconURL: `${messages.iconurl}`},
            };


            await interaction.reply({  embeds: [ chat ] })
    }
};;