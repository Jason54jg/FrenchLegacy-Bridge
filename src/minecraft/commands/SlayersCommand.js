const minecraftCommand = require("../../contracts/minecraftCommand.js");
const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");
const getSlayer = require("../../../API/stats/slayer.js");
const {
  addCommas,
  formatUsername,
} = require("../../contracts/helperFunctions.js");
const { capitalize } = require("lodash");

class SlayersCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "slayer";
    this.aliases = ["slayers"];
    this.description = "Slayer de l'utilisateur spécifié.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
      {
        name: "slayer",
        description: "Slayer type",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    try {
      const args = this.getArgs(message);
      const slayer = [
        "zombie",
        "rev",
        "spider",
        "tara",
        "wolf",
        "sven",
        "eman",
        "enderman",
        "blaze",
        "demonlord",
      ];

      const slayerType = slayer.includes(args[1]) ? args[1] : null;
      username = args[0] || username;

      const data = await getLatestProfile(username);
    
      username = formatUsername(username, data.profileData.cute_name);

      const profile = getSlayer(data.profile);

      if (slayerType) {
        this.send(
          `/msg ${username} ${username} de ${capitalize(slayerType)} - ${
            profile[slayerType].level
          } Niveaux | Experience: ${addCommas(profile[slayerType].xp)}`
        );
      } else {
        const slayer = Object.keys(profile).reduce(
          (acc, slayer) =>
            `${acc} | ${capitalize(slayer)}: Niveau: ${
              profile[slayer].level
            } | Experience: ${addCommas(profile[slayer].xp)}`,
          ""
        );
        this.send(`/msg ${username} Slayer de ${username} - ${slayer}`);
      }
      
    } catch (error) {
      this.send(`/msg ${username} Error: ${error}`);
    }
  }
}

module.exports = SlayersCommand;
