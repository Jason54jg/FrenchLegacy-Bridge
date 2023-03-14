const { getLatestProfile } = require('../../../API/functions/getLatestProfile');
const getWeight = require('../../../API/stats/weight');
const messages = require('../../../messages.json');
const wait = require('node:timers/promises').setTimeout;
const axios = require('axios');

module.exports = {
    name: 'weight',
    description: 'Récupère votre poids de senither!',
    options: [
        {
            name: 'name',
            description: 'Pseudo Minecraft',
            type: 3,
            required: false
        }
      ],


    execute: async (interaction, client) => {
        await interaction.deferReply();
		await wait(100);
        const linked = require('../../../data/discordLinked.json')
        const uuid = linked?.[interaction?.user?.id]?.data[0]
        let name = interaction.options.getString("name") || uuid
        const username = (
            await axios.get(`https://playerdb.co/api/player/minecraft/${name}`)
          ).data.data.player.username;
          const uuid2 = (
            await axios.get(`https://playerdb.co/api/player/minecraft/${name}`)
          ).data.data.player.raw_id;
        const data = await getLatestProfile(name)
        name = data.profileData?.game_mode ? `♲ ${name}` : name
        const profileweight = await getWeight(data.profile, data.uuid)
        const profilename = (data.profileData.cute_name)

        const embedplayer = {
            title: `Poids pour ${username} sur ${profilename}`,
            URL: `https://sky.shiiyu.moe/stats/${name}`,
            description: `\n`,
            thumbnail: {
                url: `https://api.mineatar.io/body/full/${name}`,
            },
            fields: [
                {
                    name: 'Senither Weight',
                    value: `${Math.round((profileweight.senither.total) * 100) / 100}`,
                },
                {
                    name: '<:MasterMode:1059665473379246091> Dungeon Weight',
                    value: `${Math.round((profileweight.senither.dungeons.total) * 100) / 100}`,
                    inline: true,
                },
                {
                    name: '<:sword:1060045450897539122> Skill Weight',
                    value: `${Math.round((profileweight.senither.skills.alchemy.total + profileweight.senither.skills.combat.total + profileweight.senither.skills.enchanting.total + profileweight.senither.skills.farming.total + profileweight.senither.skills.fishing.total + profileweight.senither.skills.foraging.total + profileweight.senither.skills.mining.total + profileweight.senither.skills.taming.total) * 100) / 100}`,
                    inline: true,
                },
                {
                    name: '<:Slayer:1060045486712696872> Slayer Weight',
                    value: `${Math.round((profileweight.senither.slayer.total) * 100) / 100}`,
                    inline: true,
                },

            ],
            timestamp: new Date().toISOString(),
            footer: {text: `${messages.footerhelp}`, iconURL: `${messages.iconurl}`},
        };


        await interaction.editReply({
            embeds: [embedplayer]
        });
  },
};