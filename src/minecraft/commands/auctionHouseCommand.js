const config = require("../../../config.json");
const { ImgurClient } = require("imgur");
const imgurClient = new ImgurClient({
  clientId: config.minecraft.API.imgurAPIkey,
});
const { addCommas, timeSince } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { renderLore } = require("../../contracts/renderItem.js");
const getRank = require("../../../API/stats/rank.js");
const axios = require("axios");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");

class AuctionHouseCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "auction";
    this.aliases = ["ah", "auctions"];
    this.description = "Enchères cotées de l'utilisateur spécifié.";
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
      let string = "";

      const uuid = await getUUID(username);
      const response =
        (
          await axios.get(
            `${config.minecraft.API.hypixelAPI}/skyblock/auction?key=${config.minecraft.API.hypixelAPIkey}&player=${uuid}`
          )
        ).data?.auctions || [];
      const player =
        (
          await axios.get(
            `${config.minecraft.API.hypixelAPI}/player?key=${config.minecraft.API.hypixelAPIkey}&uuid=${uuid}`
          )
        ).data?.player || {};

      const activeAuctions = response.filter(
        (auction) => auction.end >= Date.now()
      );

      for (const auction of activeAuctions) {
        const lore = auction.item_lore.split("\n");

        lore.push(
          "§8§m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
          `§7Seller: ${getRank(player)} ${player.displayname}`
        );

        if (auction.bin === undefined) {
          if (auction.bids.length === 0) {
            lore.push(
              `§7Starting Bid: §6${addCommas(auction.starting_bid)} coins`,
              `§7`
            );
          } else if (auction.bids.length > 0) {
            const bidder =
              (
                await axios.get(
                  `${config.minecraft.API.hypixelAPI}/player?key=${
                    config.minecraft.API.hypixelAPIkey
                  }&uuid=${auction.bids[auction.bids.length - 1].bidder}`
                )
              ).data?.player || {};
            lore.push(
              `§7Bids: §a${auction.bids.length} ${
                auction.bids.length === 1 ? "bid" : "bids"
              }`,
              `§7`,
              `§7Top Bid: §6${addCommas(
                auction.bids[auction.bids.length - 1].amount
              )} coins`,
              `§7Bidder: ${getRank(bidder)} ${bidder.displayname}`,
              `§7`
            );
          }
        } else {
          lore.push(
            `§7Achetez-le maintenant: §6${addCommas(auction.starting_bid)} coins`,
            `§7`
          );
        }

        lore.push(
          `§7Fini dans: §e${timeSince(auction.end)}`,
          `§7`,
          `§eCliquez pour inspecter`
        );

        const renderedItem = await renderLore(` ${auction.item_name}`, lore);
        const upload = await imgurClient.upload({
          image: renderedItem,
          type: "stream",
        });

        string += string === "" ? upload.data.link : " | " + upload.data.link;
      }

      this.send(
        `/gc ${
          string === ""
            ? "Ce joueur n'a pas d'enchères actives"
            : `Enchères actives de ${username}: ${string}`
        }`
      );
    } catch (error) {
      console.log(error);
      this.send(`/gc [ERREUR] ${error}`);
    }
  }
}

module.exports = AuctionHouseCommand;
