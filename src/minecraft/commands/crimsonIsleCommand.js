const { formatUsername, formatNumber } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getCrimson = require("../../../API/stats/crimson.js");

class CrimsonIsleCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "crimsonisle";
        this.aliases = ["crimson", "nether", "isle"];
        this.description = "Crimson Isle Statistiques de l'utilisateur spécifié.";
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
            const profile = getCrimson(data.profile);

            if (profile == null) {
                // eslint-disable-next-line no-throw-literal
                throw `${username} n'est jamais allé à la Crimson Isle su ${data.profileData.cute_name}.`;
            }

            this.send(
                `/gc Faction de ${username}: ${profile.faction} | Barb Rep: ${formatNumber(profile.reputation.barbarian)} | Mage Rep: ${formatNumber(profile.reputation.mage)}`,
            );
        } catch (error) {
            console.log(error);
            this.send(`/gc [ERREUR] ${error}`);
        }
    }
}

module.exports = CrimsonIsleCommand;