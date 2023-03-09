// eslint-disable-next-line
const { ImgurClient } = require("imgur");
const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");
const config = require("../../../config.json");
const imgurClient = new ImgurClient({
  clientId: config.minecraft.API.imgurAPIkey,
});
const {
  decodeData,
  formatUsername,
} = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { renderLore } = require("../../contracts/renderItem.js");

class RenderCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "render";
    this.aliases = ["inv", "i", "inventory", "i"];
    this.description = "Aperçu de l'élément de l'utilisateur spécifié.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
      {
        name: "slot",
        description: "Numéro d'emplacement de l'élément à rendre (1-36)",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    try {
      let itemNumber = 0;
      const arg = this.getArgs(message);
      if (!arg[0]) {
        this.send("/msg ${username} Mauvaise utilisation: !render [name] [slot] | !render [slot]");
      }
      if (!isNaN(Number(arg[0]))) {
        itemNumber = arg[0];
        username = arg[1] || username;
      } else {
        username = arg[0];
        if (!isNaN(Number(arg[1]))) {
          itemNumber = arg[1];
        } else {
          this.send("/msg ${username} Mauvaise utilisation: !render [name] [slot] | !render [slot]");
          return;
        }
      }

      const profile = await getLatestProfile(username);

      username = formatUsername(username, profile.profileData?.game_mode);

      if (!profile.profile.inv_contents?.data) {
        return this.send(`/gc Ce joueur a une API d'inventaire désactivée.`);
      }

      const inventoryData = (
        await decodeData(
          Buffer.from(profile.profile.inv_contents.data, "base64")
        )
      ).i;

      if (
        !inventoryData[itemNumber - 1] ||
        !Object.keys(inventoryData[itemNumber - 1] || {}).length
      ) {
        this.send(`/msg ${username} Le joueur n'a pas d'objet à l'emplacement ${itemNumber}.`);
      }

      const renderedItem = await renderLore(
        inventoryData[itemNumber - 1]?.tag?.display?.Name,
        inventoryData[itemNumber - 1]?.tag?.display?.Lore
      );

      const upload = await imgurClient.upload({
        image: renderedItem,
        type: "stream",
      });

      this.send(
        `/msg ${username} Objet de ${username} à l'emplacement ${itemNumber}: ${
          upload.data.link ?? "Quelque chose s'est mal passé..."
        }`
      );
    } catch (error) {
      this.send(`/msg ${username} Erreur: ${error}`);
    }
  }
}

module.exports = RenderCommand;
