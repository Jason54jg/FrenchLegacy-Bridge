const { capitalize, addCommas } = require('../../contracts/helperFunctions');
const hypixel = require('../../contracts/API/HypixelRebornAPI');
const { lowerCase } = require('lodash');
const messages = require('../../../messages.json')
const axios = require('axios');
const DB = require("../../../API/database/database.js");

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
        const mc_username = await DB.getLinkedAccounts(interaction.user.id) || ``
        const name = interaction.options.getString("name") || mc_username;
        const { data: { data: { player } } } = await axios.get(`https://playerdb.co/api/player/minecraft/${name}`);
        const uuid2 = player.raw_id;
        const Hypixel = (await hypixel.getPlayer(uuid2))
        const username = (await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${name}/`)).data.name || name
		const rank = (await hypixel.getPlayer(name)).rank
        const guild = await hypixel.getGuild("player", uuid2)
		const mcversion = (await hypixel.getPlayer(name)).mcVersion || `1.8x`
        const statusm = Hypixel.isOnline
        const networkLevel = Hypixel.level
        const ap = Hypixel.achievementPoints
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
                    value: `[\`${guild}\`](https://plancke.io/hypixel/guild/player/${name})`, //Pas encore d'affiche juste un lien cliquable
                    inline: true,
                },
                {
                    name: 'Statut',
                    value: `${statusm}`,
                    inline: true,
                },
                {
                    name: 'Niveau',
                    value: `${networkLevel}`,
                    inline: true,
                },
                {
                    name: `Nombre de points`,
                    value: `${ap}`,
                    inline: true,
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
                    inline: true,
                },
                {
                    name: 'Nom',
                    value: `[\`${nickname}\`](https://plancke.io/hypixel/guild/player/${name})`,
                    inline: true,
                },
                {
                    name: 'Langue',
                    value: `${lanng}`,
                    inline: true,
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