const {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require('discord.js');
const config = require("../../../config.json");

module.exports = {
    name: 'carry',
    description: `Commande pour les embeds des carrier`,

  execute: async (interaction, client) => {
        // Si l'utilisateur n'a pas la permission d'utiliser la commande
        if (! (await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole)) {
            return await interaction.followUp({
                content: "Vous n'êtes pas autorisé à exécuter cette commande.",
                ephemeral: true,
            });
        }

        const terms = new EmbedBuilder()
        .addFields({ name: 'Demandes de service', value: "Pour postuler à un rôle de service, réagissez avec 'Créer votre ticket' Veuillez noter que vous DEVEZ être vérifié pour postuler aux rôles de service. Suivez les étapes de <#1017785843458506822> si vous ne l'avez pas déjà fait avant de postuler."})
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const floor = new EmbedBuilder()
        .addFields({ name: 'Exigences du carry Floor', value: "<@&1040220987733581855> : Cata 39\n<@&1040221012832309300> : Cata 34\n<@&1040221014774251561> : Cata 30\n<@&1040221014866546718> : Cata 29\n<@&1082664044202299443> : Cata 24\n<@&1082664061197631589> : Cata 20\n<@&1082664063298965544> : Cata 15"});

        const master = new EmbedBuilder()
        .addFields({ name: 'Exigences du carry Master', value: "<@&1040221015369850890> : Cata 49 + 100 MM7 Completions + Sub 12m 30s Duo S ou Sub 10m Trio S Score Capture d'écran\n<@&1040221309474447381> : Cata 45 + Sub 7m 30s Solo S Score ou Sub 6m Duo S Score Capture d'écran\n<@&1040221311739383808> : Cata 43 + Sub 7m Solo S Score ou Sub 5m 45s Duo S Score Capture d'écran\n<@&1040221312234307624> : Cata 41 + Sub 9m 45s Solo S Score ou Sub 7m 30s Duo S Score Capture d'écran\n<@&1040221313681326102> : Cata 38 + Sub 6m 30s Solo S Score ou Sub 5m 30s Duo S Score Capture d'écran\n<@&1040221314801213452> : Cata 37 + Sub 6m Solo S Score ou Sub 5m Duo S Score Capture d'écran\n<@&1040221325228265573> : Cata 36 + Sub 5m Solo S Score ou Sub 4m Duo S Score Capture d'écran"});

        const slayer = new EmbedBuilder()
        .addFields({ name: 'Exigences du carry Slayer', value: "<@&1040221640941912104> : 100 T4 Blaze Kills + Capture d'écran d'un Sub 90s T4 Blaze Boss Kill\n<@&1040221642539929664> : 5k Blaze Slayer XP + Capture d'écran d'un Sub 45s T3 Blaze Boss Kill\n<@&1040221647543734342> : 1500 Blaze Slayer XP + Capture d'écran de Sub 40s T2 Blaze Boss Kill\n<@&1040221650349719622> : 200 T4 Eman Kills + Capture d'écran de Sub 65s T4 Eman Boss Kill\n<@&1040221652333625374> : Eman 6 + Capture d'écran de Sub 40s T3 Eman Boss Kill\n<@&1081249593808928869> : 400k Revenant XP + Capture d'écran de Sub 10s T4 Revenant Boss Kill\n<@&1040221924497821706> : 500k Revenant XP + Capture d'écran de Sub 10s T5 Revenant Boss Kill\n<@&1081249558962634902> : 200k Spider XP + Capture d'écran de Sub 10s T3 Spider Boss Kill\n<@&1081249592894554143> : 400k Spider XP + Capture d'écran de Sub 10s T4 Spider Boss Kill"});

        const kuudra = new EmbedBuilder()
        .addFields({ name: 'Exigences du carry Kuudra', value: "**Exigences pour le Carry Basic [<@&1049720607161450546>]**\n``- Hyperion Wither Impact``\n- Capture d'écran d'un **solo en moins de 6 minutes** ou d'un **duo de moins de 4 minutes**\n\n**Exigences pour le Carry Hot [<@&1049720621635997770>]**\n``- Hyperion Wither Impact``\n- Capture d'écran d'un **solo en moins de 7:30 minutes** ou d'un **duo de moins de 5:30 minutes**\n\n**Exigences pour le Carry Burning [<@&1049720624890773514>]**\n- <@&1073099916752207993>\n- Capture d'écran d'un **trio en moins de 4 minutes** ou d'un **duo en moins de 5 minutes** ou **solo**\n\n**Exigences pour le Carry Fiery [<@&1049720642745925762>]**\n- <@&1073099916752207993>\n- Capture d'écran d'un **trio en moins de 5 minutes** ou d'un **duo en moins de 7 minutes** ou **solo**\n\n**Exigences pour le Carry Infernal [<@&1081301217386446889>]**\n- <@&1073099989628227644>\n- Capture d'écran d'un **duo de moins de 10 minutes** ou **d'un trio de moins de 8 minutes** ou d'un achèvement Infernal en **solo**"});

        interaction.channel.send({embeds: [terms, floor, master, slayer, kuudra],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('carrier')
                    .setLabel('Créer un ticket')
                    .setStyle(ButtonStyle.Success)
                )
            ]
        });
    },
};