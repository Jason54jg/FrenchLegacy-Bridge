const { formatNumber, formatUsername, numberWithCommas } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getHotm = require("../../../API/stats/hotm.js");

class HotmCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "hotm";
        this.aliases = ["mining"];
        this.description = "Skyblock Hotm Statistiques de l'utilisateur spécifié.";
        this.options = [
            {
                name: "username",
                description: "Nom d'utilisateur Minecraft",
                required: false,
            },
        ];
    }

    async onCommand(username, message) {
        try {
            username = this.getArgs(message)[0] || username;

            const data = await getLatestProfile(username);

            username = formatUsername(username, data.profileData?.game_mode);

            const hotm = getHotm(data.playerRes, data.profile);

            if (hotm == null) {
                // eslint-disable-next-line no-throw-literal
                throw `${username} n'est jamais allé au Dwarven Mines sur ${data.profileData.cute_name}.`;
            }

            const level = (hotm.level.levelWithProgress || 0).toFixed(1);

            this.send(
                `/gc Hotm de ${username}: ${level} | Gemstone Powder: ${formatNumber(hotm.powder.gemstone.total)} | Mithril Powder: ${formatNumber(hotm.powder.mithril.total)} | Glacite Powder: ${formatNumber(hotm.powder.glacite.total)} | Selected Ability: ${hotm.ability} | Commissions: ${numberWithCommas(hotm.commissions.total)} | Commissions Milestone ${hotm.commissions.milestone}`,
            );
        } catch (error) {
            this.send(`/gc [ERREUR] ${error}`);
        }
    }
}

module.exports = HotmCommand;