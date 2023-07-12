const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getTalismans = require("../../../API/stats/talismans.js");
const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");

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

      const talismanCount = Object.keys(talismans.talismans)
        .map((rarity) => talismans.talismans[rarity].length || 0)
        .reduce((a, b) => a + b, 0);

      let recombobulatedCount = 0;
      let enrichmentCount = 0;
      Object.values(talismans.talismans).forEach((talismansByRarity) => {
        recombobulatedCount += talismansByRarity.filter(
          (talisman) => talisman.recombobulated !== undefined
        ).length;
        enrichmentCount += talismansByRarity.filter(
          (talisman) => talisman.enrichment !== undefined
        ).length;
      });

      this.send(
        `/msg ${username} Accessoires de ${username}: ${talismanCount} (${talismans.talismans["very"].length}V, ${talismans.talismans["special"].length}S, ${talismans.talismans["mythic"].length}M, ${talismans.talismans["legendary"].length}L, ${talismans.talismans["epic"].length}E, ${talismans.talismans["rare"].length}R, ${talismans.talismans["uncommon"].length}U, ${talismans.talismans["common"].length}C), Recombed: ${recombobulatedCount}, Enriched: ${enrichmentCount}`
      );
    } catch (error) {
      this.send(`/msg ${username} Erreur: ${error}`);
    }
  }
}

module.exports = AccessoriesCommand;
