const { formatUsername, formatNumber } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getCrimson = require("../../../API/stats/crimson.js");

class DojoCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "dojo";
        this.aliases = [];
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
                `/gc Belt de ${username}: ${profile.dojo.belt} | Best Force: ${formatNumber(profile.dojo.force.points)} | Best Stamina: ${formatNumber(profile.dojo.stamina.points)} | Best Mastery: ${formatNumber(profile.dojo.mastery.points)} | Best Discipline: ${formatNumber(profile.dojo.discipline.points)} | Best Swiftness: ${formatNumber(profile.dojo.swiftness.points)} | Best Control: ${formatNumber(profile.dojo.control.points)} | Best Tenacity: ${formatNumber(profile.dojo.tenacity.points)}`,
            );
        } catch (error) {
            console.log(error);
            this.send(`/gc [ERREUR] ${error}`);
        }
    }
}

module.exports = DojoCommand;