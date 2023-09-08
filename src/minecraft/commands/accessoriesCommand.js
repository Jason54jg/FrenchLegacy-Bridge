const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getTalismans = require("../../../API/stats/talismans.js");

class AccessoriesCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "accessories";
    this.aliases = ["acc", "talismans", "talisman"];
    this.description = "Accessoires de l'utilisateur spécifié.";
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

      const talismans = await getTalismans(data.profile);
      const rarities = Object.keys(talismans)
        .map((key) => {
          if (["recombed", "enriched", "total"].includes(key)) return;

          return [`${talismans[key]}${key[0].toUpperCase()}`];
        })
        .filter((x) => x)
        .join(", ");

      this.send(
        `/gc Accessoires de ${username}: ${
          talismans?.total ?? 0
        } (${rarities}), Recombed: ${talismans?.recombed ?? 0}, Enriched: ${
          talismans?.enriched ?? 0
        }`,
      );
    } catch (error) {
      this.send(`/gc Erreur: ${error}`);
    }
  }
}

module.exports = AccessoriesCommand;
