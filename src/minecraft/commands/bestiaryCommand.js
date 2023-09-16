const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getBestiary } = require("../../../API/stats/bestiary.js");

class bestiaryCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "bestiary";
    this.aliases = ["be"];
    this.description = "Bestiaire de l'utilisateur spécifié.";
    this.options = [
      {
        name: "username",
        description: "Mincraft Username",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    try {
      const args = this.getArgs(message);

      const mob = args[1];
      username = args[0] || username;

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);

      const bestiary = getBestiary(data.profile);
      if (bestiary === null) {
        return this.send(
          `/gc Ce joueur n'a pas encore rejoint SkyBlock depuis la mise à jour du bestiaire.`,
        );
      }

      if (mob) {
        const mobData = this.getBestiaryObject(bestiary).find((m) => m.name.toLowerCase().includes(mob.toLowerCase()));

        if (mobData) {
          this.send(
            `/gc ${username} ${mobData.name} Bestiary: ${mobData.kills} / ${mobData.nextTierKills} (${
              mobData.nextTierKills - mobData.kills
            }) `
          );

          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      this.send(
        `/gc Étape du bestiaire de ${username}: ${bestiary.milestone} / ${bestiary.maxMilestone} | Unlocked Tiers: ${bestiary.tiersUnlocked} / ${bestiary.totalTiers}`,
      );

      if (playerUsername === username) {
        const bestiaryData = this.getBestiaryObject(bestiary).sort(
          (a, b) => a.nextTierKills - a.kills - (b.nextTierKills - b.kills)
        );

        const topFive = bestiaryData.slice(0, 5);
        const topFiveMobs = topFive.map((mob) => {
          return `${mob.name}: ${mob.kills} / ${mob.nextTierKills} (${
            mob.nextTierKills - mob.kills
          })`;
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        this.send(
          `/gc Le plus proche du niveau supérieur: ${topFiveMobs.join(", ")}`,
        );
      }
    } catch (error) {
      console.log(error);
      this.send(`/gc Erreur: ${error}`);
    }
  }

  getBestiaryObject(bestiary) {
    return Object.keys(bestiary.categories)
      .map((category) => {
        if (category === "fishing") {
          Object.keys(bestiary.categories[category]).map((key) => {
            if (key === "name") return;
            return bestiary.categories[category][key].mobs.map((mob) => mob);
          });
        } else {
          return bestiary.categories[category].mobs.map((mob) => mob);
        }
      })
      .flat()
      .filter((mob) => mob?.nextTierKills != null);
  }
}

module.exports = bestiaryCommand;
