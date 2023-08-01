const hypixel = require("../../contracts/API/HypixelRebornAPI");
const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");
const { writeAt } = require("../../contracts/helperFunctions");
const messages = require("../../../messages.json");
const DB = require("../../../API/database/database.js");

module.exports = {
  name: "link",
  description: "Connectez votre compte Discord à Minecraft",
  options: [
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction, client) => {
    const username = interaction.options.getString("name");
    hypixel
      .getPlayer(username)
      .then(async (player) => {
        let found = false;
        player.socialMedia.forEach((media) => {
          if (media.link === interaction.user.username ?? interaction.user.tag) {
            found = true;
          }
        });
        if (found) {
          await DB.addLinkedAccounts(
            interaction.user.id,
            player.uuid,
            player.nickname
          );

          const successfullyLinked = new EmbedBuilder()
            .setAuthor({ name: "Lié avec succès!" })
            .setDescription(
              `Votre compte a été lié avec succès à \`${username}\``
            )
            .setFooter({
              text: `${messages.footerhelp}`,
              iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
            });
          await interaction.reply({ embeds: [successfullyLinked] });
        } else {
          const verificationTutorialEmbed = new EmbedBuilder()
            .setAuthor({
              name: "Ajoute ton hashtag discord dans le menu social de hypixel",
              iconURL:
                "https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096",
            })
            .setDescription(
              `**Instructions:** \n1) Utilisez votre client Minecraft pour vous connecter à Hypixel. \n2) Une fois connecté, et dans le lobby, cliquez avec le bouton droit de la souris sur "Mon profil" dans votre barre d'accès. C'est l'option #2. \n3) Cliquez sur "Réseaux sociaux" - ce bouton se trouve à gauche du bloc Redstone (le bouton Statut). \n4) Cliquez sur "Discord" - c'est l'avant-dernière option. \n5) Collez votre nom d'utilisateur Discord dans le chat et appuyez sur Entrée. Pour référence : \`${interaction.user.tag}\`\n6) Vous avez terminé ! Attendez environ 30 secondes, puis réessayez.\n \n**Vous obtenez "L'URL n'est pas valide!"?** \nHypixel a des limitations sur les caractères pris en charge dans un nom d'utilisateur Discord. Essayez de changer temporairement votre nom d'utilisateur Discord pour quelque chose sans caractères spéciaux, mettez-le à jour dans le jeu et réessayez.`
            )
            .setThumbnail(
              "https://thumbs.gfycat.com/DentalTemptingLeonberger-size_restricted.gif"
            )
            .setTimestamp()
            .setFooter({
              text: `${messages.footerhelp}`,
              iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
            });
          await interaction.reply({
            content:
              "Le compte lié de votre Minecraft ne correspond pas au Discord.",
            embeds: [verificationTutorialEmbed],
          });
        }
      })
      .catch((error) => {
        const errorEmbed = new EmbedBuilder()
          .setAuthor({ name: "Une erreur est survenue" })
          .setDescription(`\`${error}\``)
          .setFooter({
            text: `${messages.footerhelp}`,
            iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
          });
        interaction.reply({ embeds: [errorEmbed] });
      });
  },
};
