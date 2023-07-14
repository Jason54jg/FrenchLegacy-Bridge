const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const {
  decodeData,
  formatUsername,
} = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { renderLore } = require("../../contracts/renderItem.js");

class EquipmentCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "equipment";
    this.aliases = [];
    this.description = "Aperçu de l'équipement de l'utilisateur spécifié.";
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

      if (profile.profile?.equippment_contents?.data === undefined) {
        return this.send(
          `/msg ${username} Ce joueur a une API d'inventaire désactivée.`
        );
      }

      const { i: inventoryData } = await decodeData(
        Buffer.from(profile.profile.equippment_contents.data, "base64")
      );

      let response = "";
      for (const piece of Object.values(inventoryData)) {
        if (
          piece?.tag?.display?.Name === undefined ||
          piece?.tag?.display?.Lore === undefined
        ) {
          continue;
        }

        const Name = piece?.tag?.display?.Name;
        const Lore = piece?.tag?.display?.Lore;

        const renderedItem = await renderLore(Name, Lore);

        const upload = await uploadImage(renderedItem);

        const link = upload.data.link;

        response += response.split(" | ").length == 4 ? link : `${link} | `;
      }

      this.send(`/msg ${username} Équipement de ${username}: ${response}`);
    } catch (error) {
      this.send(`/msg ${username} Erreur: ${error}`);
    }
  }
}

module.exports = EquipmentCommand;
