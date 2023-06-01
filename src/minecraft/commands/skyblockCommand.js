const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");
const {
  formatNumber,
  addCommas,
} = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getNetworth } = require("skyhelper-networth");
const getTalismans = require("../../../API/stats/talismans.js");
const getDungeons = require("../../../API/stats/dungeons.js");
const getSkills = require("../../../API/stats/skills.js");
const getSlayer = require("../../../API/stats/slayer.js");
const getWeight = require("../../../API/stats/weight.js");

class SkyblockCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "skyblock";
    this.aliases = ["stats", "sb"];
    this.description = "Statistiques Skyblock de l'utilisateur spécifié.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;
      const data = await getLatestProfile(username);
      username = data.profileData?.game_mode ? `♲ ${username}` : username;

      if (data.status == 404) {
        return this.send(
          "/msg ${username} Il n'y a pas de joueur avec l'UUID ou le nom donné ou le joueur n'a pas de profil Skyblock"
        );
      }

      const [skills, slayer, networth, weight, dungeons, talismans] =
        await Promise.all([
          getSkills(data.profile),
          getSlayer(data.profile),
          getNetworth(data.profile, data.profileData?.banking?.balance || 0, {
            cache: true,
            onlyNetworth: true,
          }),
          getWeight(data.profile),
          getDungeons(data.player, data.profile),
          getTalismans(data.profile),
        ]);

      const senitherWeight = Math.floor(weight?.senither?.total || 0).toLocaleString();
      const lilyWeight = Math.floor(weight?.lily?.total || 0).toLocaleString();
      const skillAverage = (
        Object.keys(skills)
          .filter((skill) => !["runecrafting", "social"].includes(skill))
          .map((skill) => skills[skill].level)
          .reduce((a, b) => a + b, 0) /
        (Object.keys(skills).length - 2)
      ).toFixed(1);
      const slayerXp = addCommas(
        Object.keys(slayer)
          .map((type) => slayer[type].xp)
          .reduce((a, b) => a + b, 0)
      );
      const catacombsLevel = dungeons.catacombs.skill.level;
      const classAverage =
        Object.keys(dungeons.classes)
          .map((className) => dungeons.classes[className].level)
          .reduce((a, b) => a + b, 0) / Object.keys(dungeons.classes).length;
      const networthValue = formatNumber(
        networth.networth
      );
      const talismanCount = Object.keys(talismans.talismans)
        .map((rarity) => talismans.talismans[rarity].length || 0)
        .reduce((a, b) => a + b, 0);
      const recombobulatedCount = Object.keys(talismans.talismans)
        .map(
          (rarity) =>
            talismans.talismans[rarity].filter(
              (talisman) => talisman.recombobulated
            ).length
        )
        .reduce((a, b) => a + b, 0);
      const enrichmentCount = Object.keys(talismans.talismans)
        .map(
          (rarity) =>
            talismans.talismans[rarity].filter(
              (talisman) => talisman.enrichment !== undefined
            ).length
        )
        .reduce((a, b) => a + b, 0);

      this.send(
        `/msg ${username} Niveau de ${username}: ${
          data.profile.leveling?.experience
            ? data.profile.leveling.experience / 100
            : 0
        } | Senither Weight: ${senitherWeight} | Lily Weight: ${lilyWeight} | Skill Average: ${skillAverage} | Slayer: ${slayerXp} | Catacombs: ${catacombsLevel} | Class Average: ${classAverage} | Networth: ${networthValue} | Accessories: ${talismanCount} | Recombobulated: ${recombobulatedCount} | Enriched: ${enrichmentCount}`
      );
    } catch (error) {
      console.log(error);
      this.send(
        "/msg ${username} Il n'y a pas de joueur avec l'UUID ou le nom donné ou le joueur n'a pas de profil Skyblock"
      );
    }
  }
}

module.exports = SkyblockCommand;
