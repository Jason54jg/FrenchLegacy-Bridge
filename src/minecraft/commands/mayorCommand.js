const minecraftCommand = require("../../contracts/minecraftCommand.js");
const axios = require("axios");

class MayorCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "mayor";
        this.aliases = [];
        this.description = "Skyblock Mayor.";
        this.options = [];
    }

    async onCommand(username, message) {
        try {
            const { data } = await axios.get(`https://api.hypixel.net/v2/resources/skyblock/election`);

            if (data === undefined || data.success === false) {
                // eslint-disable-next-line no-throw-literal
                throw "La requête vers l'API Hypixel a échoué. Veuillez réessayer!";
            }
            this.send(
                `/gc [MAYOR] ${data.mayor.name} est l'actuel maire de Skyblock ! Avantages: ${data.mayor.perks.map((perk) => perk.name).join(", ")}`,
            );
        } catch (error) {
            this.send(`/gc [ERREUR] ${error}`);
        }
    }
}

module.exports = MayorCommand;