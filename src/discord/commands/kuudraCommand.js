const { default: axios } = require('axios');
const { toLower } = require('lodash');
const wait = require('node:timers/promises').setTimeout;
const messages = require('../../../messages.json');

module.exports = {
    name: 'kuudra',
    description: 'Affiche vos données kuudra',
    options: [
        {
            name: 'name',
            description: 'Pseudo Minecraft',
            type: 3,
            required: false
        },


      ],
      execute: async (interaction, client, InteractionCreate) => {
        await interaction.deferReply();
        const linked = require('../../../data/discordLinked.json')
        const uuid = linked?.[interaction?.user?.id]?.data[0]
        let name = interaction.options.getString("name") || uuid
        const { data } = await axios.get(`https://playerdb.co/api/player/minecraft/${name}`)
        const username = data.data.player.username;
        const uuid2 = data.data.player.raw_id;
        const { profiles } = (await axios.get(`https://sky.shiiyu.moe/api/v2/profile/${uuid2}`)).data
        const currentProfile = Object.keys(profiles).find(key => profiles[key].current);
        const { cute_name, raw } = profiles[currentProfile];
        const { kuudra_completed_tiers } = raw.nether_island_player_data;
        const tiers = ["none", "hot", "burning", "fiery", "infernal"];
        const waves = ["highest_wave_none", "highest_wave_hot", "highest_wave_burning", "highest_wave_fiery", "highest_wave_infernal"];
        const t1comp = kuudra_completed_tiers[tiers[0]] ?? "0";
        const t2comp = kuudra_completed_tiers[tiers[1]] ?? "0";
        const t3comp = kuudra_completed_tiers[tiers[2]] ?? "0";
        const t4comp = kuudra_completed_tiers[tiers[3]] ?? "0";
        const t5comp = kuudra_completed_tiers[tiers[4]] ?? "0";
        const t1wave = kuudra_completed_tiers[waves[0]] ?? "0";
        const t2wave = kuudra_completed_tiers[waves[1]] ?? "0";
        const t3wave = kuudra_completed_tiers[waves[2]] ?? "0";
        const t4wave = kuudra_completed_tiers[waves[3]] ?? "0";
        const t5wave = kuudra_completed_tiers[waves[4]] ?? "0";
        const pfmess = raw.nether_island_player_data.kuudra_party_finder.group_builder.note ?? "Paper";
        const pft = raw.nether_island_player_data.kuudra_party_finder.group_builder.tier ?? "basic";
        const pfreq = raw.nether_island_player_data.kuudra_party_finder.group_builder.combat_level_required ?? "0";

        const embed = {
            title: `Données Kuudra pour ${username} sur ${cute_name}`,
            URL: `https://sky.shiiyu.moe/stats/${name}`,
            description: (`Message du partie finder: **${pfmess}**\nNiveau pour rejoindre la partie: **${pfreq}**\nTier de la partie en kuudra: **${toLower(pft)}**`),
            thumbnail: {
                url: `https://api.mineatar.io/body/full/${name}`,
            },
            fields: [
                {
                    name: "Kuudra Tier 1",
                    value: `Completion terminées: \`${t1comp}\`\nVague la plus haute: \`${t1wave}\``,
                    inline: false
                },
                {
                    name: "Kuudra Tier 2",
                    value: `Completion terminées: \`${t2comp}\`\nVague la plus haute: \`${t2wave}\``,
                    inline: true
                },
                {
                    name: "Kuudra Tier 3",
                    value: `Completion terminées: \`${t3comp}\`\nVague la plus haute: \`${t3wave}\``,
                    inline: false
                },
                {
                    name: "Kuudra Tier 4",
                    value: `Completion terminées: \`${t4comp}\`\nVague la plus haute: \`${t4wave}\``,
                    inline: true
                },
                {
                    name: "Kuudra Tier 5",
                    value: `Completion terminées: \`${t5comp}\`\nVague la plus haute: \`${t5wave}\``,
                    inline: false
                },

            ],
            timestamp: new Date().toISOString(),
            footer: {text: `${messages.footerhelp}`, iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`},
            };

            await interaction.editReply({  embeds: [ embed ] })
    }
};