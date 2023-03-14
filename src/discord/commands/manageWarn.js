const config = require("../../../config.json");
const DB = require("../../../API/database/database.js");

module.exports = {
    name: 'warns',
    description: `Gérer les warns des utilisateurs`,
    options: [
        {
          name: "action",
          description: "Action a effectuer",
          type: 3,
          required: true,
          choices: [
            { name: "Ajouter", value: "add" },
            { name: "Enlever", value: "rm" },
            { name: "Définir", value: "set" }
          ]
        },
        {
          name: "nombre",
          description: "Nombre de warn",
          type: 3, 
          required: true,
        },
        {
          name: "joueur",
          description: "[Optionel] Joueur ciblé, laissez vide pour cibler tout le monde",
          type: 6,
          required: false,
        }
    ],
    execute: async (interaction) => {
		// Si l'utilisateur n'a pas la permission d'utiliser la commande
		if (!(await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole)) {
			return await interaction.reply({
				content: `${messages.permissionInsuffisante}`,
				ephemeral: true,
			});
		}
	
		const choice = interaction.options.get("action").value;
		let warn = interaction.options.get("nombre").value;
		let user = interaction.options.get("joueur");
		
		// Vérifie si le numéro renseigné est bien un nombre
		if(isNaN(warn)){
			return await interaction.reply({
				content: "Le nombre renseigné n'est pas valide",
				ephemeral: true,
			});
		}
		warn = parseInt(warn);

		// Vérifie si le joueur renseigné existe
		if(user != null) {
			user = await DB.getUserById(user.value);
			if(user == null) {
				return await interaction.reply({
					content: "L'utilisateur que vous avez renseigné n'a pas été trouvé.",
					ephemeral: true,
				});
			}
		}
		
		// Effectuer l'action
		switch(choice){
			case "add":
				user == null ? DB.addWarnToAll(warn) : DB.addWarnToUser(user.discordId, warn);
				break;
			case "rm":
				user == null ? DB.addWarnToAll(-warn) : DB.addWarnToUser(user.discordId, -warn);
				break;
			case "set":
				user == null ? DB.setWarnToAll(warn) : DB.setWarnToUser(user.discordId, warn);
				break;
		}
	
	
		return interaction.reply({ 
			content: `${messages.commandeRéussi}`,
			ephemeral: true 
		});
    }
}