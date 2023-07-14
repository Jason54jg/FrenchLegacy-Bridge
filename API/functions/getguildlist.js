const config = require("../../config.json");
const requete = require("./requete");

const Mojang = "https://sessionserver.mojang.com/session/minecraft/profile/";
const api_key = config.minecraft.API.hypixelAPIkey;
const hypixel_api = config.minecraft.API.hypixelAPI;

async function delay(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

async function guild_list(guild) {
  // Récuperer la guilde renseignée
  const rep = await requete.get_page(
    `${hypixel_api}/guild?key=${api_key}&name=${guild}`
  );
  if (!rep.success) {
    return "L'interaction avec l'api à échoué";
  }
  const guilde = rep.guild;

  // Trier par ordre décroissant de priority
  const ranks = guilde.ranks;
  ranks.sort((a, b) => {
    return b.priority - a.priority;
  });
  ranks.unshift({ name: "Guild Master", tag: "GM" });

  // On récupère les infos de chaque membre de la guilde
  let memberInfo = [];
  for (let i = 0; i < guilde.members.length; i++) {
    let playerInfo = {};
    const member = guilde.members[i];

    // Récuperer le rank du joueur (de la guilde)
    playerInfo.rank = member.rank;

    // Vérifier si le joueur est en ligne
    const player = await requete.get_page(
      `${hypixel_api}/status?key=${api_key}&uuid=${member.uuid}`
    );
    player.success
      ? (playerInfo.online = player.session.online)
      : (playerInfo.online = false);

    // Récuperer le pseudo du joueur
    const response = await requete.get_page(Mojang + member.uuid);
    response != null
      ? (playerInfo.name = response.name)
      : (playerInfo.name = "???");

    // Ajouter le joueur construit à la liste des joueurs a afficher dans l'embed
    memberInfo.push(playerInfo);

    // API throttle (60 req/min)
    await delay(1000);
  }

  return { ranks: ranks, memberInfo: memberInfo };
}
module.exports = { guild_list };
