const minecraftCommand = require("../../contracts/minecraftCommand.js");
const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getWeight = require("../../../API/stats/weight.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");

class StatsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "weight";
    this.aliases = ["w"];
    this.description = "Weight Skyblock de l'utilisateur spécifié.";
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

      username = formatUsername(data.profileData?.displayname || username);

      const profile = getWeight(data.profile, data.uuid);

      const lilyW = `Lily Weight: ${profile.lily.total.toFixed(
        2
      )} | Skills: ${profile.lily.skills.total.toFixed(
        2
      )} | Slayer: ${profile.lily.slayer.total.toFixed(
        2
      )} | Dungeons: ${profile.lily.catacombs.total.toFixed(2)}`;
      const senitherW = `Senither Weight: ${profile.senither.total.toFixed(
        2
      )} | Skills: ${Object.keys(profile.senither.skills)
        .map((skill) => profile.senither.skills[skill].total)
        .reduce((a, b) => a + b, 0)
        .toFixed(2)} | Dungeons: ${profile.senither.dungeons.total.toFixed(2)}`;
      this.send(`/msg ${username} ${username} ${senitherW}`);
      await delay(690);
      this.send(`/msg ${username} ${username} ${lilyW}`);
    } catch (error) {
      this.send(`/msg ${username} Error: ${error}`);
    }
  }
}

module.exports = StatsCommand;
