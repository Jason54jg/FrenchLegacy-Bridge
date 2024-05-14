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
            // CREDITS: by @Kathund (https://github.com/Kathund)
            const { data } = await axios.get(`https://api.hypixel.net/v2/resources/skyblock/election`);

            if (data === undefined || data.success === false) {
                // eslint-disable-next-line no-throw-literal
                throw "La requête vers l'API Hypixel a échoué. Veuillez réessayer!";
            }

            if (data.current.candidates.length === 0) {
                this.send(
                    `/gc [MAYOR] ${data.mayor.name} est l'actuel maire de Skyblock ! Avantages: ${data.mayor.perks
                        .map((perk) => perk.name)
                        .join(", ")}`,
                );
            } else {
                const currentLeader = data.current.candidates.sort((a, b) => b.votes - a.votes)[0];
                this.send(
                    `/gc [MAYOR] ${data.mayor.name} est l'actuel maire de Skyblock ! Avantages: ${data.mayor.perks
                        .map((perk) => perk.name)
                        .join(", ")} | Élection en cours: ${currentLeader.name}`,
                );
            }
        } catch (error) {
            this.send(`/gc [ERREUR] ${error}`);
        }
    }
}

module.exports = MayorCommand;