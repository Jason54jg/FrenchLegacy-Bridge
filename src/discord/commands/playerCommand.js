const { capitalize, addCommas } = require('../../contracts/helperFunctions');
const hypixel = require('../../contracts/API/HypixelRebornAPI');
const { lowerCase } = require('lodash');
const messages = require('../../../messages.json')
const axios = require('axios');

module.exports = {
    name: 'player',
    description: 'Récupère les données Hypixel',
    options: [{
        name: 'name',
        description: 'Pseudo Minecraft',
        type: 3,
		required: false
    }],

	execute: async (interaction, client) => {
        const linked = require('../../../data/discordLinked.json')
        const uuid = linked?.[interaction?.user?.id]?.data[0]
        let name = interaction.options.getString("name") || uuid
        const username = (await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}/`)).data.name || name
		const rank = (await hypixel.getPlayer(name)).rank
		const guild = (await hypixel.getPlayer(name)).guild || `? ? ?`
		const mcversion = (await hypixel.getPlayer(name)).mcVersion || `1.8x`
		const status = (await hypixel.getPlayer(name)).isOnline
		const level = (await hypixel.getPlayer(name)).level
		const expall = (await hypixel.getPlayer(name)).totalExperience
		const karma = (await hypixel.getPlayer(name)).karma
		const nickname = (await hypixel.getPlayer(name)).nickname
		const lang = (await hypixel.getPlayer(name)).userLanguage
		const expofall = addCommas(expall)
		const language = lowerCase(lang)
		const lanng = capitalize(language)
		const karmadata = addCommas(karma)
		const embeded = {
			title: `Affichage des statistiques Hypixel pour ${username}`,
            URL: `https://plancke.io/hypixel/player/stats/${name}`,
			description: (`\n`),
			thumbnail: {
				url: `https://api.mineatar.io/body/full/${name}`,
			},
			fields: [{
					name: 'Rang',
					value: `${rank}`,
					inline: true,
                },
                {
                    name: 'Guilde',
                    value: `${guild}`, //Pas encore fonctionnel
                    inline: true,
                },
                {
                    name: 'Statut',
                    value: `${status}`,
                    inline: true,
                },
                {
                    name: 'Niveau',
                    value: `${level}`,
                },
                {
                    name: `Total d'experience`,
                    value: `${expofall}`,
                    inline: true,
                },
                {
                    name: `Total de Karma`,
                    value: `${karmadata}`,
                    inline: true,
                },
                {
                    name: 'Version Mc',
                    value: `${mcversion}`,
                },
                {
                    name: 'Nom',
                    value: `${nickname}`,
                },
                {
                    name: 'Langue',
                    value: `${lanng}`,
                },
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: `${messages.footerhelp}`, iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
            },
        };

        await interaction.reply({
            embeds: [embeded]
        })
    },
};