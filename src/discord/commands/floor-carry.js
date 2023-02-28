const {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require('discord.js');
const config = require("../../../config.json");

module.exports = {
    name: 'floor',
    description: `Commande pour les embeds de floor`,

  execute: async (interaction, client) => {
    if ((await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole)) {
        const terms = new EmbedBuilder()
        .addFields(
            { name: 'Termes et conditions', value: "**1)** Dans les 30 minutes suivant l'ouverture d'un ticket, veuillez indiquer votre IGN et le nombre de runs que vous souhaitez ainsi que le score.\n**2)** Ne faites pas un ticket de carry si vous n'êtes pas prêt à le recevoir.\n**3)** Le paiement est effectué d'avance, sans exception.\n**4)** Si vous mourez plus de 2 fois et que le score est inférieur à celui que vous avez commandé, nous ne sommes pas obligés de compenser votre perte.\n**5)** Si vous vous déconnectez pendant le carry, le carrier tentera de vous warp. Si vous n'êtes pas en mesure de revenir, vous avez 48 heures pour réclamer les coins, sinon elles appartiendront au carrier.\n**6)** Une fois que vous entrez dans le donjon, la classe que vous choisissez dépend du carrier afin qu'il puisse vous proposer un carry plus efficace.\n**7)** Votre carry est considéré comme terminé lorsque le carry se termine et que vous obtenez le score que vous avez commandé.\n**8)** Tout le butin que vous recevez est entièrement à vous."},
            { name: "__**Remarques**__", value: "Vous pouvez être averti si vous ouvrez un ticket et n'y envoyez pas de message pendant 30 minutes. Vous pouvez recevoir un avertissement si vous ne donner pas de réponse pendant plus d'un jour. Si vous êtes averti plus de 5 fois vous recevrez une liste noir de tickets."},
        )
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const floor1 = new EmbedBuilder()
		.setAuthor({ name: 'Floor 4', iconURL: 'https://cdn.discordapp.com/emojis/759298333608378388.png'})
        .setThumbnail('https://cdn.discordapp.com/emojis/759298333608378388.png')
        .addFields(
            { name: 'Completion', value: '- 1 Run: 300k\n- 5 ou plus: 220k/unité', inline: true },
            { name: 'S Runs', value: '- 1 Run: 400k\n- 5 ou plus: 350k/unité', inline: true },
        )
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const floor2 = new EmbedBuilder()
		.setAuthor({ name: 'Floor 5', iconURL: 'https://cdn.discordapp.com/emojis/759298251068801044.png'})
        .setThumbnail('https://cdn.discordapp.com/emojis/759298251068801044.png')
        .addFields(
            { name: 'Completion', value: '- 1 Run: 275k\n- 5 ou plus: 250k/unité', inline: true },
            { name: 'S Runs', value: '- 1 Run: 350k\n- 5 or more Runs: 300k/unité', inline: true },
            { name: 'S+ Runs', value: '- 1 Run: 600k\n- 5 ou plus: 540k/unité', inline: true },
        )
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const floor3 = new EmbedBuilder()
		.setAuthor({ name: 'Floor 6', iconURL: 'https://cdn.discordapp.com/emojis/761951536829825035.png'})
        .setThumbnail('https://cdn.discordapp.com/emojis/761951536829825035.png')
        .addFields(
            { name: 'Completion', value: '- 1 Run: 400k\n- 5 ou plus: 350k/unité', inline: true },
            { name: 'S Runs', value: '- 1 Run: 625k\n- 5 ou plus: 550k/unité', inline: true },
            { name: 'S+ Runs', value: '- 1 Run: 850k\n- 5 ou plus: 775k/unité', inline: true },
        )
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const floor4 = new EmbedBuilder()
		.setAuthor({ name: 'Floor 7', iconURL: 'https://cdn.discordapp.com/emojis/833916984886427678.png'})
        .setThumbnail('https://cdn.discordapp.com/emojis/833916984886427678.png')
        .addFields(
            { name: 'Completion', value: '- 1 Run: 3m\n- 5 ou plus: 2.5m/unité', inline: true },
            { name: 'S Runs', value: '- 1 Run: 6m\n- 5 ou plus: 5.4m/unité', inline: true },
            { name: 'S+ Runs', value: '- 1 Run: 8m\n- 5 ou plus: 7.2m/unité', inline: true },
        )
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const floor5 = new EmbedBuilder()
        .setTitle("Conditions d'entrée")
        .setDescription("Veuillez vous assurer que vous remplissez les conditions d'entrée lors de la création d'un ticket. Les conditions d'entrée sont les suivantes:")
        .addFields({ name: '▬▬▬▬▬▬▬▬', value: "L'étage 4 nécessite Catacombes niveau 9\nL'étage 5 nécessite Catacombes niveau 14\nL'étage 6 nécessite Catacombes niveau 19\nL'étage 7 nécessite Catacombes niveau 24", inline: true })
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/242779914330177536/1074676859788328992/fl_orange.png"});

        const service = new EmbedBuilder()
        .addFields({ name: 'Services de carry donjon', value: "<:Thorn:1039692699625865276>: Floor 4\n<:Livid:1039692626665934900>: Floor 5\n<:Sadan:1039692739488534580>: Floor 6\n<:Necron:1040832502417338458>: Floor 7\n\n(Ce sont les prix des carry publique, les membres de la guilde auront une réduction de prix)"})
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

		interaction.channel.send({embeds: [terms, floor1, floor2, floor3, floor4, floor5, service],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('f4')
                        .setLabel('F4')
                        .setEmoji('1039692699625865276')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('f5')
                        .setLabel('F5')
                        .setEmoji('1039692626665934900')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('f6')
                        .setLabel('F6')
                        .setEmoji('1039692739488534580')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('f7')
                        .setLabel('F7')
                        .setEmoji('1040832502417338458')
                        .setStyle(ButtonStyle.Primary),
                    )
                ]
        })
    } else {
      await interaction.followUp({
        content: "Vous n'êtes pas autorisé à exécuter cette commande.",
        ephemeral: true,
      });
    }
  },
};