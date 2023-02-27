const guild_list=require("../../../API/functions/getguildlist")
const {EmbedBuilder}=require("discord.js");
const { cp } = require("fs");



module.exports={guild_online}

async function guild_online(guild){
    let embed= new EmbedBuilder()
    if (guild==undefined){
        embed.setColor(0x099FF)
        embed.setTitle("Erreur")
        embed.setDescription("vous devez spécifiez une guild avec l'options guild")
    }
    else{
    const transition=await guild_list.guild_list(guild);
    const guild_liste=transition[0]
    const k=guild_liste.length
    const liste_member_rank=transition[1]
    const liste_rank_sanstag=transition[2]
    const liste_ranks_affichage=transition[3]
    const en_ligne=transition[4];
    /*let à_afficher="";
    for (let i=0;i<guild_liste.length;i++){
      à_afficher+=guild_liste[i];
      à_afficher+='\n'
    }
    */
      embed.setColor(0x0099ff)
      embed.setTitle("Membres de la guild")
    console.log(liste_rank_sanstag)
    for (let i=0;i<liste_rank_sanstag.length;i++){
        let rank_affich=liste_rank_sanstag[i]
        let a_afficher=""
        let a_afficher1=""
        let b=0
        let c=0;
        for (let j=0;j<liste_member_rank.length;j++){
            let member_rank=liste_member_rank[j]
            if (member_rank==rank_affich){
                if (en_ligne[j]==false){
                a_afficher+="``"+guild_liste[j]+"❌`` "}
                else{
                  if (en_ligne[j]=="?"){
                    a_afficher+="``"+guild_liste[j]+"❓`` "}
                  else{
                  a_afficher+="``"+guild_liste[j]+"✔️`` "}}
                b+=1
                if (b>50){
                  if (c==0){
                    c=1
                    a_afficher1=a_afficher
                a_afficher=""
              }
         }}}
        //embed.addFields()
        console.log(a_afficher)
        console.log("a afficher")
        console.log(liste_ranks_affichage[i]+" >> "+b.toString())
        //try{
        if (c==0){
        embed.addFields({
            name:liste_ranks_affichage[i]+" >> "+b.toString(),
            value:a_afficher,
        })}
        else{
          embed.addFields({
            name:liste_ranks_affichage[i]+" >> "+b.toString(),
            value:a_afficher1,
            inline:false
        })
          embed.addFields({
            name:'\u200b',
            value:a_afficher,
            inline:true
          })
        }
          //}
        //catch (error){
          //console.log(error)
          //console.log("error")
        //}
    }
    embed.setDescription("Guild Member count : **"+k.toString()+"/125**")
    }

    return(embed)
  }
