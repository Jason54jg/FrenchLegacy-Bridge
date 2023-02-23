// eslint-disable-next-line
const { ImgurClient } = require("imgur");
const config = require("../../../config.json");
const imgurClient = new ImgurClient({
  clientId: config.minecraft.API.imgurAPIkey,
});
const {
  getRarityColor,
  formatUsername,
} = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { renderLore } = require("../../contracts/renderItem.js");
const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");
const getPets = require("../../../API/stats/pets.js");

class RenderCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "pet";
    this.aliases = ["pets"];
    this.description = "Aperçu de l'animal de compagnie actif de l'utilisateur spécifié.";
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

      const profile = getPets(data.profile);

      for (const pet of profile.pets) {
        if (pet.active) {
          const lore = pet.lore;
          const newLore = [];
          let newLine = [];

          for (const line of lore) {
            if (!line.includes("Total XP")) {
              newLine = line.split(". ");
              if (newLine.length > 0) {
                for (const l of newLine) {
                  newLore.push(l);
                }
              } else {
                newLore.push(newLine);
              }
            } else {
              newLore.push(line);
            }
          }

          const renderedItem = await renderLore(
            `§7[Lvl ${pet.level}] §${getRarityColor(pet.tier)}${
              pet.display_name
            }`,
            newLore
          );

          const upload = await imgurClient.upload({
            image: renderedItem,
            type: "stream",
          });

          return this.send(
            `/gc Animal de compagnie actif de ${username}: ${
              upload.data.link ?? "Quelque chose s'est mal passé.."
            }`
          );
        }
      }

      this.send(`/gc ${username} n'a pas d'animal de compagnie équipé.`);
    } catch (error) {
      this.send(`/gc Erreur: ${error}`);
    }
  }
}

module.exports = RenderCommand;
