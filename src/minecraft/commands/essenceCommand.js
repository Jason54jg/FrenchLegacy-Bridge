const { formatNumber, formatUsername } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getDungeons = require("../../../API/stats/dungeons.js");

class EssenceCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "essence";
        this.aliases = [];
        this.description = "Skyblock Dungeons Statistiques de l'utilisateur spécifié.";
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

            const dungeons = getDungeons(data.profile);

            if (dungeons == null) {
                // eslint-disable-next-line no-throw-literal
                throw `${username} n'a jamais joué aux donjons sur ${data.profileData.cute_name}.`;
            }

            this.send(
                `/gc Essence de diamant de ${username}: ${formatNumber(dungeons.essence.diamond, 0)} | Dragon: ${formatNumber(dungeons.essence.dragon, 0)} Spider: ${formatNumber(dungeons.essence.spider, 0)} | Wither: ${formatNumber(dungeons.essence.wither, 0)} | Undead: ${formatNumber(dungeons.essence.undead, 0)} | Gold: ${formatNumber(dungeons.essence.gold, 0)} | Ice: ${formatNumber(dungeons.essence.ice, 0)} | Crimson: ${formatNumber(dungeons.essence.crimson, 0)}`,
            );
        } catch (error) {
            console.log(error);

            this.send(`/gc [ERREUR] ${error}`);
        }
    }
}

module.exports = EssenceCommand;