const config = require("../../../config.json");
const DB = require("../../../API/database/database.js");
const messages = require("../../../messages.json");

module.exports = {
  name: "points",
  description: `Gérer les points des utilisateurs`,
  options: [
    {
      name: "action",
      description: "Action a effectuer",
      type: 3,
      required: true,
      choices: [
        { name: "Ajouter", value: "add" },
        { name: "Enlever", value: "rm" },
        { name: "Définir", value: "set" },
      ],
    },
    {
      name: "nombre",
      description: "Nombre de points",
      type: 3,
      required: true,
    },
    {
      name: "joueur",
      description:
        "[Optionel] Joueur ciblé, laissez vide pour cibler tout le monde",
      type: 6,
      required: false,
    },
  ],
  execute: async (interaction) => {
    // Si l'utilisateur n'a pas la permission d'utiliser la commande
    if (
      !(
        await interaction.guild.members.fetch(interaction.user)
      ).roles.cache.has(config.discord.roles.commandRole)
    ) {
      return await interaction.reply({
        content: `${messages.permissionInsuffisante}`,
        ephemeral: true,
      });
    }

    const choice = interaction.options.get("action").value;
    let score = interaction.options.get("nombre").value;
    let user = interaction.options.get("joueur");

    // Vérifie si le score est un nombre
    if (isNaN(score)) {
      return await interaction.reply({
        content: "Le nombre renseigné n'est pas valide",
        ephemeral: true,
      });
    }
    score = parseInt(score);

    // Vérifie si le joueur renseigné existe
    if (user != null) {
      user = await DB.getUserById(user.value);
      if (user == null) {
        return await interaction.reply({
          content: "L'utilisateur que vous avez renseigné n'a pas été trouvé.",
          ephemeral: true,
        });
      }
    }

    // Effectuer l'action
    switch (choice) {
      case "add":
        user == null
          ? DB.addScoreToAll(score)
          : DB.addScoreToUser(user.discordId, score);
        break;
      case "rm":
        user == null
          ? DB.addScoreToAll(-score)
          : DB.addScoreToUser(user.discordId, -score);
        break;
      case "set":
        user == null
          ? DB.setScoreToAll(score)
          : DB.setScoreToUser(user.discordId, score);
        break;
    }

    return interaction.reply({
      content: `${messages.commandeRéussi}`,
      ephemeral: true,
    });
  },
};
