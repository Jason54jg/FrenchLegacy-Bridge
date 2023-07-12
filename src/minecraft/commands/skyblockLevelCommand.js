const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");

class CatacombsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "level";
    this.aliases = ["lvl"];
    this.description = "Niveau Skyblock de l'utilisateur spécifié.";
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

      const experience = data.profile.leveling?.experience ?? 0;
      this.send(
        `/msg ${username} Niveau Skyblock de ${username}: ${experience ? experience / 100 : 0}`
      );
    } catch (error) {
      console.log(error);

      this.send(`/msg ${username} Erreur: ${error}`);
    }
  }
}

module.exports = CatacombsCommand;
