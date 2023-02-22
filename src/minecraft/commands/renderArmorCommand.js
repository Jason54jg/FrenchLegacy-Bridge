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

class ArmorCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "armor";
    this.aliases = [];
    this.description = "Aperçu de l'armure de l'utilisateur spécifié.";
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

      const profile = await getLatestProfile(username);
      
      username = formatUsername(username, profile.profileData?.game_mode);

      if (!profile.profile.inv_armor?.data) {
        return this.send(`/gc Ce joueur a une API d'inventaire désactivée.`);
      }

      const inventoryData = (
        await decodeData(Buffer.from(profile.profile.inv_armor.data, "base64"))
      ).i;

      let response = "";
      for (const piece of Object.values(inventoryData)) {
        if (piece?.tag?.display?.Name === undefined) continue;

        const renderedItem = await renderLore(
          piece?.tag?.display?.Name,
          piece?.tag?.display?.Lore
        );
        const upload = await imgurClient.upload({
          image: renderedItem,
          type: "stream",
        });

        response +=
          response.split(" | ").length == 4
            ? upload.data.link
            : `${upload.data.link} | `;
      }

      response == ""
        ? this.send(`/gc ${username} n'a pas d'armure équipée.`)
        : this.send(`/gc L'armure de ${username}: ${response}`);

    } catch (error) {
      this.send(`/gc Erreur: ${error}`);
    }
  }
}

module.exports = ArmorCommand;
