const {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require('discord.js');
const config = require("../../../config.json");

module.exports = {
    name: 'slayer',
    description: `Commande pour les embeds de slayer`,

  execute: async (interaction, client) => {
    if ((await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole)) {

        const rev = new EmbedBuilder()
        .setThumbnail('https://cdn.discordapp.com/emojis/884973282615500870.png')
        .addFields({ name: 'Informations sur les prix des T5 Rev', value: 'Atoned Horror: 200k/unité\nPrix pour (5 ou plus) : 150k/unité'})
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const enderman = new EmbedBuilder()
        .setThumbnail('https://cdn.discordapp.com/emojis/862880360529395752.png')
        .addFields({ name: 'Informations sur les prix du Slayer Enderman', value: 'Voidgloom Seraph 3: 800k/unité\nPrix T3 pour (10 ou plus) : 600k/unité\nVoidgloom Seraph 4: 2m/unité\nPrix T4 pour (10 ou plus) : 1.5m/unité'})
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const inferno = new EmbedBuilder()
        .setThumbnail('https://cdn.discordapp.com/attachments/822369588204929024/966770068119781466/unknown.png')
        .addFields( { name: 'Informations sur les prix des Inferno', value: 'Inferno Demonlord 2: 800k / pour (10+) 650k/unité\nInferno Demonlord 3: 2.2m / pour (10+) 2m/unité'})
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const important = new EmbedBuilder()
        .addFields({ name: '⚠️ Informations importantes pour les clients ⚠️', value: "- Pour les carry en gros, veillez à ne pas payer plus de 25m à la fois. Si votre transporteur vous met la pression pour payer plus que ce montant, veuillez créer un ticket dans <#999022746619084961> et les signaler.\n- Tous les services de slayer nécessitent au moins 25 de combat.\n- Si votre carrier fait du RCM à vos slayer, veuillez créer un ticket de support et les signaler en conséquence. Nous n'autorisons pas les carry RCM Eman.\n\nRemarque :\n- Il est plus pratique pour vous d'être proche du spawn de votre boss avant de créer un ticket. Cela vous fait gagner un peu de temps à vous et au carrier.\n\n**❗ Il peut y avoir de longs temps d'attente pour les carry de blaze depuis que l'armure de Sorrow a été nerfée.**", inline: true })
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const terms = new EmbedBuilder()
        .addFields(
            { name: 'Termes et conditions', value: "**1)** Dans les 30 minutes suivant l'ouverture d'un ticket, veuillez indiquer votre IGN, le type de slayer que vous voulez, le nombre de boss que vous voulez et le niveau de boss que vous voulez passer.\n**2)** Ne créez pas de ticket de service si vous n'êtes pas prêt à le recevoir.\n**3)** Tenter d'escroquer les carrier de slayer entraînera un bannissement.\n**4)** Le paiement est effectué d'avance.\n**5)** Vous devez être Combat 25 pour utiliser ce service.\n**6)** Si vous mourez à cause de vos propres erreurs, les carrier n'ont pas à refaire le boss pour vous. Votre carrier doit vous expliquer les règles très clairement.\n**7)** Tout le butin que vous obtenez du boss est à VOUS. Cela vaut également si vous obtenez des objets exceptionnellement rares.\n**8)** Votre carry est terminé lorsque vous recevez l'expérience du slayer suite à la mort du boss.\n**9)**  Les prix indiqués ne sont pas négociables, toute tentative de sous-enchère entraînera un avertissement." },
            { name: '__**Remarques**__', value: "- Vous serez averti si vous enfreignez l'une des règles ci-dessus.\n- Vous serez averti si vous ouvrez un ticket et n'y envoyez pas de message pendant 30 minutes.\n- Si vous êtes averti plus de 5 fois vous recevrez une liste noie de tickets."},
        )
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const conditions = new EmbedBuilder()
        .addFields({ name: 'Conditions', value: "Veuillez noter que vous devez avoir tué le niveau précédent avant de commander le niveau suivant. Cela signifie qu'avant de commander un carry de niveau 3, vous devez avoir au moins un kill de niveau 2. Avant de commander un carry de niveau 4, vous devez avoir tué au moins un niveau 3.\n\nVeuillez également vous assurer que vous êtes au moins au combat 25 afin de pouvoir entrer dans la void sépulture.\nSi vous commandez un revenant de niveau 5, assurez-vous que vous êtes au combat 25, tueur de revenants de niveau 7 et que vous avez tué au moins un boss revenant de niveau 4. Sinon, vous serez prévenu."})
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const carry = new EmbedBuilder()
        .addFields({ name: 'Service de carry Slayer', value: "<:Blaze:1039705790501617745>: Service de carry Inferno Demonlord\n<:Enderman:1039706047214014464>: Service de carry des void seraph\n<:Revenant:1039706422465794158>: Service de carry revenant horror\n\n(Ce sont les prix des carry publique, les membres de la guilde auront une réduction de prix)"})
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

		interaction.channel.send({embeds: [terms, conditions, rev, enderman, inferno, carry, important],
            components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('REV')
                        .setLabel('T5')
                        .setEmoji('1039706422465794158')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('T3eman')
                        .setLabel('T3')
                        .setEmoji('1039706047214014464')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('T4eman')
                        .setLabel('T4')
                        .setEmoji('1039706047214014464')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('T2blaze')
                        .setLabel('T2')
                        .setEmoji('1039705790501617745')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('T3blaze')
                        .setLabel('T3')
                        .setEmoji('1039705790501617745')
                        .setStyle(ButtonStyle.Primary),
                    )
                ]
        });
    } else {
      await interaction.followUp({
        content: "Vous n'êtes pas autorisé à exécuter cette commande.",
        ephemeral: true,
      });
    }
  },
};