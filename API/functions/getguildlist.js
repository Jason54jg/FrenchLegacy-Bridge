const https = require('https');
const config = require("../../config.json");
const requete= require("./requete") 
const uuid_username= require("./uuid_name")

const Mojang="https://sessionserver.mojang.com/session/minecraft/profile/";
const api_key=config.minecraft.API.hypixelAPIkey;
const hypixel_api=config.minecraft.API.hypixelAPI;


function get_pagedeux(page){
    const https = require('https');

    https.get(page, (resp) => {
      let data = '';
    
      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });
    
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        console.log(data)
        return(data);
      });
    
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
}


async function guild_list(guild){
    const page=hypixel_api+"/guild"+"?key="+api_key+"&name="+guild;
    const rep = await requete.get_page(page);
    const success=rep.success;
    const guildeee=rep.guild;
    //const {success,guildeee}=rep;
    console.log(guildeee);
    console.log("sucess")
    if (success==false){
        return("L'interaction avec l'api à échoué");
    }
    const membre=guildeee.members;
    let liste_uuid=[];
    for (let i=0;i<membre.length;i++){
      liste_uuid.push(membre[i].uuid);
    }
    console.log(liste_uuid);
    console.log("c'est la liste des uuid")
    let guild_liste= await uuid_username.uuid_username(liste_uuid)
    console.log(guild_liste);
    console.log("C la guild liste")
    return(guild_liste);
}
module.exports={guild_list};
