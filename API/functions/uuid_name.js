const requete = require("./requete");
const DB = require("../database/database.js");


const Mojang = "https://sessionserver.mojang.com/session/minecraft/profile/";

async function uuid_username(liste_uuid) {
    let liste_membre = [];

    for (let i = 0; i < liste_uuid.length; i++) {
        let uuid = liste_uuid[i];
        let user = await DB.getUserByUuid(uuid);

        // Ajouter les membres dans la db si l'uuid n'est pas retrouvé
        if (user == null) {
            // Récuperation des informations sur le joueur à ajouter
            let page_web = await requete.get_page(Mojang + uuid);

            if (page_web.name != null) {
                // Création du joueur en db
                DB.createUser(uuid, page_web.name);
                liste_membre.push(page_web.name);
            }
        } else {
            liste_membre.push(user.mc_username);
        }
    }
    return liste_membre;
}

module.exports = { uuid_username };
