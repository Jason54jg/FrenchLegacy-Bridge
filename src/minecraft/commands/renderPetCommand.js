const { getRarityColor, formatUsername } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const { renderLore } = require("../../contracts/renderItem.js");
const getPets = require("../../../API/stats/pets.js");

class RenderCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "pet";
    this.aliases = ["pets"];
    this.description =
      "Aperçu de l'animal de compagnie actif de l'utilisateur spécifié.";
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

      if (profile.length === 0) {
        return this.send(`/gc ${username} n'a pas d'animaux de compagnie.`);
      }

      const pet = profile.pets.find((pet) => pet.active === true);

      if (pet === undefined) {
        return this.send(`/gc ${username} n'a pas d'animal équipé.`);
      }

      const renderedItem = await renderLore(
        `§7[Lvl ${pet.level}] §${getRarityColor(pet.tier)}${pet.display_name}`,
        pet.lore,
      );

      const upload = await uploadImage(renderedItem);

      return this.send(
        `/sg ${username} ${username} n'a pas d'animal de compagnie équipé: ${
          upload.data.link ?? "Quelque chose s'est mal passé.."
        }`,
      );
    } catch (error) {
      this.send(`/gc Erreur: ${error}`);
    }
  }
}

module.exports = RenderCommand;
