const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getNetworth } = require("skyhelper-networth");
const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");
const {
  formatNumber,
  formatUsername,
} = require("../../contracts/helperFunctions.js");

class NetWorthCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "networth";
    this.aliases = ["nw"];
    this.description = "Networth de l'utilisateur spécifié.";
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

      const profile = await getNetworth(
        data.profile,
        data.profileData?.banking?.balance || 0,
        { cache: true, onlyNetworth: true }
      );

      if (profile.noInventory === true) {
        return this.send(`/msg ${username} ${username} a une API d'inventaire désactivée!`);
      }

      this.send(`/msg ${username} Le Networth de ${username} est ${formatNumber(profile.networth)} | Unsoulbound Networth: ${formatNumber(profile.unsoulboundNetworth)} | Purse: ${formatNumber(profile.purse)} | Bank: ${formatNumber(profile.bank)}`);
    } catch (error) {
      console.log(error);
      this.send(`/msg ${username} ERREUR: ${error}`);
    }
  }
}

module.exports = NetWorthCommand;
