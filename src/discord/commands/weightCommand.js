const { getLatestProfile } = require("../../../API/functions/getLatestProfile");
const getWeight = require("../../../API/stats/weight");
const messages = require("../../../messages.json");
const wait = require("node:timers/promises").setTimeout;
const axios = require("axios");
const DB = require("../../../API/database/database.js");

module.exports = {
  name: "weight",
  description: "Récupère votre poids de senither!",
  options: [
    {
      name: "name",
      description: "Pseudo Minecraft",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction, client) => {
    const mc_username = (await DB.getLinkedAccounts(interaction.user.id)) || ``;
    const name = interaction.options.getString("name") || mc_username;
    const username = (
      await axios.get(`https://playerdb.co/api/player/minecraft/${name}`)
    ).data.data.player.username;
    const uuid2 = (
      await axios.get(`https://playerdb.co/api/player/minecraft/${name}`)
    ).data.data.player.raw_id;
    const data = await getLatestProfile(name);
    const profileweight = await getWeight(data.profile, data.uuid);
    const profilename = data.profileData.cute_name;

    const embedplayer = {
      title: `Poids pour ${username} sur ${profilename}`,
      URL: `https://sky.shiiyu.moe/stats/${name}`,
      description: `\n`,
      thumbnail: {
        url: `https://api.mineatar.io/body/full/${name}`,
      },
      fields: [
        {
          name: "Senither Weight",
          value: `${Math.round(profileweight.senither.total * 100) / 100}`,
          inline: true,
        },
        {
          name: "Dungeon Weight",
          value: `${
            Math.round(profileweight.senither.dungeons.total * 100) / 100
          }`,
          inline: true,
        },
        {
          name: "Skill Weight",
          value: `${
            Math.round(
              (profileweight.senither.skills.alchemy.total +
                profileweight.senither.skills.combat.total +
                profileweight.senither.skills.enchanting.total +
                profileweight.senither.skills.farming.total +
                profileweight.senither.skills.fishing.total +
                profileweight.senither.skills.foraging.total +
                profileweight.senither.skills.mining.total +
                profileweight.senither.skills.taming.total) *
                100,
            ) / 100
          }`,
          inline: true,
        },
        {
          name: "Slayer Weight",
          value: `${
            Math.round(profileweight.senither.slayer.total * 100) / 100
          }`,
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: `${messages.footerhelp}`,
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      },
    };

    await interaction.followUp({
      embeds: [embedplayer],
    });
  },
};
