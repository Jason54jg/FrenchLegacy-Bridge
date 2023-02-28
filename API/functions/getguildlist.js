const { cp } = require('fs');
const https = require('https');
const config = require("../../config.json");
const requete = require("./requete") 
const uuid_username = require("./uuid_name")

const Mojang = "https://sessionserver.mojang.com/session/minecraft/profile/";
const api_key = config.minecraft.API.hypixelAPIkey;
const hypixel_api = config.minecraft.API.hypixelAPI;

async function delay(ms) {
  return await new Promise(resolve => setTimeout(resolve, ms));
}

function get_pagedeux(page) {
    const https = require('https');

    https.get(page, (resp) => {
      let data = '';
    
      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });
    
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        return(data);
      });
    
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
}


async function guild_list(guild) {
    const page = hypixel_api + "/guild" + "?key=" + api_key + "&name=" + guild;
    const rep = await requete.get_page(page);
    const success = rep.success;
    const guildeee = rep.guild;
    if (success == false) {
        return("L'interaction avec l'api à échoué");
    }
    const membre = guildeee.members;
    let liste_uuid = [];
    let rankss = []
    let rankssanstag = []
    let num = []
    let liste_member_rank = [];
    let onlines = []
    for (let i=0;i<membre.length;i++) {
      liste_uuid.push(membre[i].uuid);
      let p = await requete.get_page(hypixel_api + "/status" + "?key=" + api_key + "&uuid=" + membre[i].uuid)
      try {
        let onli = p.session.online

      onlines.push(p.session.online)
      liste_member_rank.push(membre[i].rank)}
      catch (error) {
        onlines.push("?")
        const a = await delay(10000)
      }
    }
    let_ranks_non_tries = guildeee["ranks"];
    for (let i = 0;i<let_ranks_non_tries.length;i++) {
      let numero = let_ranks_non_tries[i].priority
      let nom_rank_provi = let_ranks_non_tries[i].name
      let tag_rank = let_ranks_non_tries[i].tag
      let nom_rank = nom_rank_provi + " [" + tag_rank + "]"
      let a = 0
      for (let j = 0;j<num.length;j++) {
        if (num[j]<numero) {
          if (a == 0) {
          num.splice(j, 0, numero)
          rankss.splice(j, 0, nom_rank)
          rankssanstag.splice(j, 0, nom_rank_provi)
          a = 1
          j += 1}
        }}
      if (a == 0) {
        num.push(numero)
        rankss.push(nom_rank)
        rankssanstag.push(nom_rank_provi)
      }
    }
    rankss.splice(0, 0, 'Guild Master [GM]')
    rankssanstag.splice(0, 0, "Guild Master")
    let guild_liste = await uuid_username.uuid_username(liste_uuid)
    return([guild_liste, liste_member_rank, rankssanstag, rankss, onlines]);
  }
module.exports = { guild_list };
