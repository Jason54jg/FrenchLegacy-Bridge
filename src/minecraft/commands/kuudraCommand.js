const { formatUsername, formatNumber } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getCrimson = require("../../../API/stats/crimson.js");

class KuudraCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "kuudra";
        this.aliases = [];
        this.description = "Statistiques Kuudra de l'utilisateur spécifié.";
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
                `/gc Basic de ${username} : ${formatNumber(profile.kuudra.basic)} | Hot: ${formatNumber(profile.kuudra.hot)} | Burning: ${formatNumber(profile.kuudra.burning)} | Fiery: ${formatNumber(profile.kuudra.fiery)} | Infernal: ${formatNumber(profile.kuudra.infernal)}`,
            );
        } catch (error) {
            console.log(error);
            this.send(`/gc [ERREUR] ${error}`);
        }
    }
}

module.exports = KuudraCommand;