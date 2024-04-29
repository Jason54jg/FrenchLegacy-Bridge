const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getHotm = require("../../../API/stats/hotm.js");

class ForgeCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "forge";
        this.aliases = [];
        this.description = "Skyblock Forge Info Statistiques de l'utilisateur spécifié.";
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

            const hotm = getHotm(data.playerRes, data.profile);

            if (hotm == null) {
                // eslint-disable-next-line no-throw-literal
                throw `${username} n'est jamais allé au Dwarven Mines sur ${data.profileData.cute_name}.`;
            }

            if (hotm.forge.length === 0 || hotm.forge == null) {
                // eslint-disable-next-line no-throw-literal
                throw `${username} il n'y a aucun objet dans la forge.`;
            }

            const forgeItems = hotm.forge.map((item) => {
                return `Slot ${item.slot}: ${item.name} ${item.timeFinishedText}`;
            });
            this.send(`/gc Forge de ${username} : ${forgeItems.join(" | ")}`);
        } catch (error) {
            this.send(`/gc [ERREUR] ${error}`);
        }
    }
}

module.exports = ForgeCommand;