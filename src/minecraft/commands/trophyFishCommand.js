const { formatUsername, formatNumber } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getCrimson = require("../../../API/stats/crimson.js");

class TrophyFishCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "trophyfish";
        this.aliases = ["tf", "trophyfishing", "trophy"];
        this.description = "Statistiques Dojo de l'utilisateur spécifié.";
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
                throw `${username} n'est jamais allé à la Crimson Isle sur ${data.profileData.cute_name}.`;
            }

            this.send(
                `/gc Rang de pêche au trophée de ${username}: ${profile.trophyFishing.rank} | Total Caught: ${formatNumber(profile.trophyFishing.caught.total)} | Total Bronze: ${formatNumber(profile.trophyFishing.caught.bronze)} | Total Silver: ${formatNumber(profile.trophyFishing.caught.silver)} | Total Gold: ${formatNumber(profile.trophyFishing.caught.gold)} | Total Diamond: ${formatNumber(profile.trophyFishing.caught.diamond)}`,
            );
        } catch (error) {
            console.log(error);
            this.send(`/gc [ERREUR] ${error}`);
        }
    }
}

module.exports = TrophyFishCommand;