const requete= require("./requete");
const fs= require('fs').promises;
let data= require("./uuid_name_stocké.json");


const Mojang="https://sessionserver.mojang.com/session/minecraft/profile/";

async function uuid_username(liste_uuid){
    return new Promise((resolve,rejects)=>{
        setTimeout(async ()=>{
            /*
            fs.readFileSync('./uuid_name_stocké.txt',function(error,data){
                const fichier=data;
                console.log(data);
                console.log("aller")
        })
            console.log(fichier)
            console.log("fichier")
            let data = JSON.parse(fichier)
            console.log(data)
            console.log("le fichier")
            */
            let liste_membre=[];
            console.log(data)
            console.log("en mémoire")
            for (let i=0;i<liste_uuid.length;i++){//5 pour test, mettre liste_uuid.length
                let uuid=liste_uuid[i];
                if (data[uuid]==undefined){
                    let page_web=await requete.get_page(Mojang+uuid);
                    let {id,name,properties}=page_web;
                    console.log(name)
                    let a_ecrire={uuid:name}
                    console.log(a_ecrire);
                    /*
                    fs.appendFileSync("./uuid_name_stocké.json",JSON.stringify(a_ecrire),function(erreur){
                        if (erreur){
                            console.log(erreur);
                            rejects("erreur lors de l'ouverture de la base de données"+erreur);
                        }
                    });
                    */
                    data[uuid]=name;
                    liste_membre.push(name);
                
                }
                else{
                    liste_membre.push(data[uuid]);
                }
            }
        console.log(JSON.stringify(data));
        console.log("c'est les data")
            /*
            fs.writeFileSync("uuid_name_stocké.json",data,function(erreur){
                if (erreur){
                    console.log(erreur);
                    rejects("erreur lors de l'ouverture de la base de données"+erreur);
                }
        });
       await fs.writeFile("./uuid_name_stocké.json",JSON.stringify(data),{ flag: 'wq' },function(err) {
        if (err) 
            return console.error(err); 
        const data2=await fs.readFile('./uuid_name_stocké.json', 'utf-8', function (err, data2) {
            if (err)
                return console.error(err);
            console.log(data2);
            console.log("écrit")
        })})
        */
       await fs.writeFile("./API/functions/uuid_name_stocké.json",JSON.stringify(data))
       const data2=await fs.readFile("./API/functions/uuid_name_stocké.json")
       console.log(JSON.parse(data2))
       console.log("bis")
        resolve(liste_membre);
        },0)
    })
}

module.exports={uuid_username};
