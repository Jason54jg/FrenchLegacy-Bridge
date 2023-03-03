const {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require('discord.js');
const config = require("../../../config.json");

module.exports = {
    name: 'kuudra',
    description: `Commande pour les embeds des kuudra`,

  execute: async (interaction, client) => {
        // Si l'utilisateur n'a pas la permission d'utiliser la commande
        if (! (await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole)) {
            return await interaction.followUp({
                content: "Vous n'êtes pas autorisé à exécuter cette commande.",
                ephemeral: true,
            });
        }

        const terms = new EmbedBuilder()
        .addFields(
            { name: 'Termes et conditions', value: "**1)** Dans les 30 minutes suivant l'ouverture d'un ticket, veuillez indiquer votre IGN et le nombre de runs que vous souhaitez.\n**2)** Ne faites pas de ticket de service si vous n'êtes pas prêt à le recevoir.\n**3)** Le paiement est effectué d'avance, sans exception.\n**4)** Une fois que vous entrez dans le kuudra, la classe que vous choisissez dépend du carrier afin qu'il puisse vous proposer un carry plus efficace.\n**5)** Votre carry est considéré comme terminé lorsque le carry se termine et que vous obtenez le score que vous avez commandé.\n**6)** Tout le butin que vous recevez est entièrement à vous."},
            { name: '__**Remarques**__', value: "Vous pouvez être averti si vous ouvrez un ticket et n'y envoyez pas de message pendant 30 minutes. Vous pouvez recevoir un avertissement si vous ne donner pas de réponse pendant plus d'un jour. Si vous êtes averti plus de 5 fois vous recevrez une liste noir de tickets."},
        )
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const kuudra1 = new EmbedBuilder()
        .setAuthor({ name: 'Kuudra Basic Tier', iconURL: 'https://cdn.discordapp.com/emojis/1049723395740274709.png'})
        .setThumbnail('https://cdn.discordapp.com/emojis/1049723395740274709.png')
        .addFields({ name: 'Runs', value: '- 1 Run: 4m\n- 5 ou plus: 3m/unité'})
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const kuudra2 = new EmbedBuilder()
        .setAuthor({ name: 'Kuudra Hot Tier', iconURL: 'https://cdn.discordapp.com/emojis/1049723395740274709.png'})
        .setThumbnail('https://cdn.discordapp.com/emojis/1049723395740274709.png')
        .addFields({ name: 'Runs', value: '- 1 Run: 6m\n- 5 ou plus: 5m/unité'})
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const kuudra3 = new EmbedBuilder()
        .setAuthor({ name: 'Kuudra Burning Tier', iconURL: 'https://cdn.discordapp.com/emojis/1049723395740274709.png'})
        .setThumbnail('https://cdn.discordapp.com/emojis/1049723395740274709.png')
        .addFields({ name: 'Runs', value: '- 1 Run: 13m\n- 5 ou plus: 12m/unité'})
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const kuudra4 = new EmbedBuilder()
        .setAuthor({ name: 'Kuudra Fiery Tier', iconURL: 'https://cdn.discordapp.com/emojis/1049723395740274709.png'})
        .setThumbnail('https://cdn.discordapp.com/emojis/1049723395740274709.png')
        .addFields({ name: 'Runs', value: '- 1 Run: 18m\n- 5 ou plus: 17m/unité'})
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const kuudra5 = new EmbedBuilder()
        .setAuthor({ name: 'Kuudra Infernal Tier', iconURL: 'https://cdn.discordapp.com/emojis/1049723395740274709.png'})
        .setThumbnail('https://cdn.discordapp.com/emojis/1049723395740274709.png')
        .addFields({ name: 'Runs', value: '- 1 Run: 60m\n- 5 ou plus: 50m/unité'})
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const conditions = new EmbedBuilder()
        .setTitle("Conditions d'entrée")
        .setDescription("Veuillez vous assurer que vous remplissez les conditions d'entrée lors de la création d'un ticket. Les conditions d'entrée sont les suivantes:")
        .addFields({ name: '▬▬▬▬▬▬▬▬', value: "Kuudra Basic Tier nécessite l'chèvement de la quête\nKuudra Hot Tier nécessite 1,000 de reputation\nKuudra Burning Tier nécessite 3,000 de reputation\nKuudra Fiery Tier nécessite 7,000 de reputation\n\nRemarque : l'achèvement des niveaux précédents est requis pour entrer dans le niveau pour lequel vous achetez un carry.", inline: true })
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const service = new EmbedBuilder()
        .addFields({ name: 'Services de carry kuudra', value: "<:Kuudra:1049723395740274709>: Kuudra Basic Tier\n<:Kuudra:1049723395740274709>: Kuudra Hot Tier\n<:Kuudra:1049723395740274709>: Kuudra Burning Tier\n<:Kuudra:1049723395740274709>: Kuudra Fiery Tier\n<:Kuudra:1049723395740274709>: Kuudra Infernal Tier\n\n(Ce sont les prix des carry publique, les membres de la guilde auront une réduction de prix)"})
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        interaction.channel.send({embeds: [conditions, terms, kuudra1, kuudra2, kuudra3, kuudra4, kuudra5, service],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('k1')
                        .setLabel('Basic')
                        .setEmoji('1049723395740274709')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('k2')
                        .setLabel('Hot')
                        .setEmoji('1049723395740274709')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('k3')
                        .setLabel('Burning')
                        .setEmoji('1049723395740274709')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('k4')
                        .setLabel('Fiery')
                        .setEmoji('1049723395740274709')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('k5')
                        .setLabel('Infernal')
                        .setEmoji('1049723395740274709')
                        .setStyle(ButtonStyle.Primary),
                    )
                ]
        })
    },
};