const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");
const { getStats } = require("../../contracts/helperFunctions.js");
const config = require("../../../config.json");
const axios = require("axios");

class WeeklyStatsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "weekly";
    this.aliases = [""];
    this.description = "Obtenir les statistiques hebdomadaires de l'utilisateur spécifié.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
      {
        name: "mode",
        description: "Gamemode",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    const modes = [
      "bw",
      "bedwars",
      "bedwar",
      "bws",
      "sw",
      "skywars",
      "skywar",
      "sws",
      "duels",
      "duel",
      "d",
    ];
    const args = this.getArgs(message).map((arg) => arg.replaceAll("/", ""));

    const mode = modes.includes(args[0])
      ? args[0]
      : modes.includes(args[1])
      ? args[1]
      : null;
    username =
      (args[0] == mode
        ? args[1] === ""
          ? username
          : args[1]
        : args[0] === ""
        ? username
        : args[0]) || username;

    try {
      const uuid = await getUUID(username);

      this.send(await getStats(username, uuid, mode, "weekly"));
    } catch (error) {
      if (error === "Joueur pas dans la base de données") {
        this.send(
          `/msg ${username} ${username} n'est pas enregistré dans la base de données! Les ajouter maintenant..`
        );

        const uuid = await getUUID(username);
        const res = await axios.post(
          `https://api.pixelic.de/v1/player/register/${uuid}?key=${config.minecraft.API.pixelicAPIkey}`
        );

        if (res.status == 201) {
          this.send(`/gc ${username} a été enregistré avec succès dans la base de données!`);

        } else if (res.status == 400) {
          this.send(
            `/msg ${username} Oh oh, en quelque sorte ce joueur est déjà enregistré dans la base de données! Veuillez réessayer dans quelques secondes..`
          );
        } else {
          this.send(
            `/msg ${username} Erreur: ${res.status} ${
              res?.statusText || "Quelque chose s'est mal passé.."
            }`
          );
        }
      } else {
        this.send(`/msg ${username} Erreur: ${error}`);
      }
    }
  }
}

module.exports = WeeklyStatsCommand;
