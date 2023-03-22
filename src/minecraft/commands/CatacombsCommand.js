const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getDungeons = require("../../../API/stats/dungeons.js");
const {
  numberWithCommas,
  formatUsername,
} = require("../../contracts/helperFunctions.js");
const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");

class CatacombsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "catacombs";
    this.aliases = ["cata", "dungeons"];
    this.description = "Skyblock Dungeons Statistiques de l'utilisateur spécifié.";
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

      username = formatUsername(username, data.profileData?.game_mode);

      const dungeons = getDungeons(data.player, data.profile);

      if (dungeons == null) {
        throw `${username} n'a jamais joué aux donjons sur ${data.profileData.cute_name}.`;
      }

      const completions =
        Object.values(dungeons.catacombs.MASTER_MODE_FLOORS)
          .map((floor) => floor.completions)
          .reduce((a, b) => a + b, 0) +
        Object.values(dungeons.catacombs.floors)
          .map((floor) => floor.completions)
          .reduce((a, b) => a + b, 0);

      this.send(
        `/msg ${username} Catacombes: ${
          dungeons.catacombs.skill.level > 50
            ? dungeons.catacombs.skill.levelWithProgress.toFixed(2)
            : dungeons.catacombs.skill.level
        } | Moyenne de la classe: ${
          Object.keys(dungeons.classes)
            .map((className) => dungeons.classes[className].level)
            .reduce((a, b) => a + b, 0) / Object.keys(dungeons.classes).length
        } | Secrets trouvés: ${numberWithCommas(dungeons.secrets_found || 0)} (${(
          dungeons.secrets_found / completions
        ).toFixed(2)} SPR) | Classes: ${
          dungeons.classes.healer.level
        }H - ${dungeons.classes.mage.level}M - ${
          dungeons.classes.berserk.level
        }B - ${dungeons.classes.archer.level}A - ${
          dungeons.classes.tank.level
        }T`
      );
    } catch (error) {
      console.log(error);

      this.send(`/msg ${username} Erreur: ${error}`);
    }
  }
}

module.exports = CatacombsCommand;
