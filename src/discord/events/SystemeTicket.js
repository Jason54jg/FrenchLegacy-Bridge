const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const config = require("../../../config.json");
const Logger = require("../.././Logger.js");
const sourcebin = require("sourcebin_js");
const DB = require("../../../API/database/database.js");

const roles = config.discord.roles;
const buttonCloseTicket = new ButtonBuilder()
    .setCustomId('ticket-close')
    .setLabel(' | fermer le ticket')
    .setEmoji("🔒")
    .setStyle(ButtonStyle.Danger);
const buttonClaimTicket = new ButtonBuilder()
    .setCustomId('claim')
    .setLabel(' | Claim')
    .setEmoji('📩')
    .setDisabled(false)
    .setStyle(ButtonStyle.Secondary);


module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        if (interaction.isModalSubmit()) {
            manageModalInteraction(interaction, client);
            return;
        }
        if (!interaction.isButton()) return;

        let catégoriecarry = roles.catégoriecarry;
        let catégorieticket = roles.catégorieticket;

        let roleStaff = interaction.guild.roles.cache.get(roles.commandRole);

        let DejaUnChannel = interaction.guild.channels.cache.find(c => c.topic == interaction.user.id);

        if (interaction.customId.includes("ticket-close")) {
            const channel = interaction.channel;
            const member = interaction.guild.members.cache.get(channel.topic);
            const requestId = interaction.customId.split("-")[2];

            const rowPanel = new ActionRowBuilder().addComponents(buttonCloseTicket);

            await interaction.message.edit({ components: [rowPanel] });



            const rowDeleteFalse = new ActionRowBuilder().addComponents(buttonCloseTicket.setDisabled(true));

            const rowDeleteTrue = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("🗑️")
                    .setDisabled(false)
                    .setCustomId(`ticket-delete${requestId != null ? `-${requestId}` : ""}`)
            );

            const embed = new EmbedBuilder()
                .setTitle("Fermer le ticket!")
                .setDescription(
                    `ticket fermé par <@${interaction.user.id}>!\n\n**Appuyez sur le bouton 🗑️ pour supprimer le ticket!**`
                )

            interaction.reply({ embeds: [embed], components: [rowDeleteFalse] })
                .then(() =>
                    setTimeout(() => {
                        interaction.channel.edit({ name: `fermer-${member == undefined ? channel.topic : member.user.username}` });
                        interaction.editReply({ components: [rowDeleteTrue] });
                    }, 2000)
                );

            if (member == undefined) { return };
            interaction.channel.permissionOverwrites.edit(member, { ViewChannel: false });
        } else if (interaction.customId.includes("carry")) {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })

            const modal = new ModalBuilder()
                .setCustomId(interaction.customId.split("-")[1])
                .setTitle('Combien de carry devez-vous effectuer ?')

            const nbCarryInput = new TextInputBuilder()
                .setCustomId('numberOfCarry')
                .setLabel("Entrez le nombre de carry a effectuer")
                .setStyle(TextInputStyle.Short)
                .setMaxLength(4)
                .setMinLength(1)
                .setPlaceholder('Exemple: 1, 2, 5, ...')
                .setValue('1');
            const ignInput = new TextInputBuilder()
                .setCustomId('ign')
                .setLabel("Entrez votre IGN")
                .setStyle(TextInputStyle.Short)
                .setMaxLength(16)
                .setMinLength(1)
                .setPlaceholder('Exemple: A6sT, CherchePas, ...');

            const nbCarryRow = new ActionRowBuilder().addComponents(nbCarryInput);
            const ignRow = new ActionRowBuilder().addComponents(ignInput);
            modal.addComponents(nbCarryRow, ignRow);
            await interaction.showModal(modal);

        } else if (interaction.customId === "claim") {
            // Verifie que ce n'est pas la personne à l'origine du ticket qui claim
            if (interaction.message.mentions.users.keys().next().value == interaction.user.id) {
                return interaction.reply({
                    embeds: [{
                        description: `Vous ne pouvez pas claim votre propre ticket !`,
                        footer: {
                            text: "FrenchLegacy"
                        },
                    }],
                    ephemeral: true
                })
            }

            // Vérifie que la personne qui claim possède le role
            if (!interaction.member._roles.includes(interaction.message.content.split('&')[1].split('>')[0])) {
                return interaction.reply({
                    embeds: [{
                        description: `Vous ne possedez pas le rôle pour claim ce ticket !`,
                        footer: {
                            text: "FrenchLegacy"
                        },
                    }],
                    ephemeral: true
                })
            }

            // Envoyer la réponse
            interaction.reply({
                embeds: [{
                    description: `Votre salon a été pris en charge par ${interaction.user}`,
                    footer: {
                        text: "FrenchLegacy"
                    },
                }],
                components: [
                    new ActionRowBuilder()
                        .addComponents(new ButtonBuilder()
                            .setCustomId('claim-end')
                            .setLabel(' | Carry effectué')
                            .setEmoji("🔒")
                            .setStyle(ButtonStyle.Success)
                        )
                ]
            })
            // Désactiver le bouton de claim
            interaction.message.edit({
                components: [new ActionRowBuilder().addComponents(buttonCloseTicket, buttonClaimTicket.setDisabled(true))]
            })

        } else if (interaction.customId === "claim-end") {
            // Verifie que la personne qui clique sur ce bouton soit bien la personne qui a claim
            if (! interaction.message.embeds[0].description.split('@')[1].split('>')[0] == interaction.user.id) {
                return interaction.reply({
                    embeds: [{
                        description: `Seul la personne qui a claim ce ticket peut effectuer cette action !`,
                        footer: {
                            text: "FrenchLegacy"
                        },
                    }],
                    ephemeral: true
                })
            }

            // Créer un formulaire où le carrier renseigne le nombre de carry effectué
            const modal = new ModalBuilder()
                .setCustomId("claim-end")
                .setTitle('Combien de carry avez-vous fait ?')

            const nbCarryInput = new TextInputBuilder()
                .setCustomId('numberOfCarry')
                .setLabel("Entrez le nombre de carry que vous avez fait")
                .setStyle(TextInputStyle.Short)
                .setMaxLength(4)
                .setMinLength(1)
                .setPlaceholder('Exemple: 1, 2, 5, ...')
                .setValue('1');

            const nbCarryRow = new ActionRowBuilder().addComponents(nbCarryInput);
            modal.addComponents(nbCarryRow);
            await interaction.showModal(modal);

        }
        else if (interaction.customId.includes("ticket-delete") && interaction.channel.name.includes("fermer")) {
            closeTicket(interaction, interaction.customId.split("-")[2]);
        } else if (interaction.customId == "ticket") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `ticket ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégorieticket}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    },
                    {
                        id: roleStaff,
                        allow: [PermissionFlagsBits.ViewChannel]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${roleStaff} | ${interaction.user}`,
                    embeds: [{
                        description: "Bonjour , Nous vous remercions pour avoir prit contact avec nous. Un membre du staff vous aidera dans les plus brefs délais. En attendant, veuillez nous décrire la raison de ce ticket le plus précisemment possible.",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket)
                    ]
                })
                interaction.reply({
                    content: `Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "carrier") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `carrier ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégoriecarry}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    },
                    {
                        id: roleStaff,
                        allow: [PermissionFlagsBits.ViewChannel]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${roleStaff} | ${interaction.user}`,
                    embeds: [{
                        description: "Veuillez nous indiquer dans quelle catégorie vous voulez faire des carry",
                        footer: {
                            text: "BlackPast",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(new ButtonBuilder()
                                .setCustomId('ticket-close-carrierrequest')
                                .setLabel(' | fermer le ticket')
                                .setEmoji("🔒")
                                .setStyle(ButtonStyle.Danger)
                            )
                    ]
                })
                interaction.reply({
                    content: `Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "roles_vip") {
            if (interaction.member.roles.cache.has('999026248590315661')) {
                interaction.member.roles.remove('999026248590315661');
                interaction.reply({ content: `Votre rôle VIP vous a été retiré avec succès.`, ephemeral: true });
                Logger.discordMessage(`[Grade] VIP a été retiré à ${interaction.user.username}`)
            } else {
                interaction.member.roles.add('999026248590315661');
                interaction.reply({ content: `Votre rôle VIP vous a été attribué avec succès.`, ephemeral: true });
                Logger.discordMessage(`[Grade] VIP a été donné à ${interaction.user.username}`)
            }

        } else if (interaction.customId == "roles_vip+") {
            if (interaction.member.roles.cache.has('999026425644470293')) {
                interaction.member.roles.remove('999026425644470293');
                interaction.reply({ content: `Votre rôle VIP+ vous a été retiré avec succès.`, ephemeral: true });
                Logger.discordMessage(`[Grade] VIP+ a été retiré à ${interaction.user.username}`)
            } else {
                interaction.member.roles.add('999026425644470293');
                interaction.reply({ content: `Votre rôle VIP+ vous a été attribué avec succès.`, ephemeral: true });
                Logger.discordMessage(`[Grade] VIP+ a été donné à ${interaction.user.username}`)
            }
            
        } else if (interaction.customId == "roles_mvp") {
            if (interaction.member.roles.cache.has('999026463569367142')) {
                interaction.member.roles.remove('999026463569367142');
                interaction.reply({ content: `Votre rôle MVP vous a été retiré avec succès.`, ephemeral: true });
                Logger.discordMessage(`[Grade] MVP a été retiré à ${interaction.user.username}`)
            } else {
                interaction.member.roles.add('999026463569367142');
                interaction.reply({ content: `Votre rôle MVP vous a été attribué avec succès.`, ephemeral: true });
                Logger.discordMessage(`[Grade] MVP a été donné à ${interaction.user.username}`)
            }   

        } else if (interaction.customId == "roles_mvp+") {
            if (interaction.member.roles.cache.has('999026519252930660')) {
                interaction.member.roles.remove('999026519252930660');
                interaction.reply({ content: `Votre rôle MVP+ vous a été retiré avec succès.`, ephemeral: true });
                Logger.discordMessage(`[Grade] MVP+ a été retiré à ${interaction.user.username}`)
            } else {
                interaction.member.roles.add('999026519252930660');
                interaction.reply({ content: `Votre rôle MVP+ vous a été attribué avec succès.`, ephemeral: true });
                Logger.discordMessage(`[Grade] MVP+ a été donné à ${interaction.user.username}`)
            }

        } else if (interaction.customId == "roles_mvp++") {
            if (interaction.member.roles.cache.has('999026564018753626')) {
                interaction.member.roles.remove('999026564018753626');
                interaction.reply({ content: `Votre rôle MVP++ vous a été retiré avec succès.`, ephemeral: true });
                Logger.discordMessage(`[Grade] MVP a été retiré à ${interaction.user.username}`)
            } else {
                interaction.member.roles.add('999026564018753626');
                interaction.reply({ content: `Votre rôle MVP++ vous a été attribué avec succès.`, ephemeral: true });
                Logger.discordMessage(`[Grade] MVP a été donné à ${interaction.user.username}`)
            }
        }
    }
}

async function manageModalInteraction(interaction, client) {
    if (interaction.customId.includes('claim-end')) {
        let carryAmount = interaction.fields.getTextInputValue('numberOfCarry');

        // Si la valeur renseigné n'est pas un nombre
        if (isNaN(carryAmount) || carryAmount < 1) {
            return interaction.reply({
                embeds: [{
                    description: `Vous devez renseigner un nombre valide afin de pouvoir fermer ce ticket`,
                    footer: {
                        text: "FrenchLegacy"
                    },
                }],
                ephemeral: true
            })
        }

        const messages = await interaction.message.channel.messages.fetch();
        const firstMessage = Array.from(messages)[messages.size - 1][1];

        // Données issue du message principal
        carryAmount = parseInt(carryAmount);
        const nbCarryTotal = parseInt(firstMessage.content.split("/")[1].split("c")[0].trim());
        const nbCarryDone = parseInt(firstMessage.content.split("|")[2].split("/")[0].trim());
        const pointsTotal = parseInt(firstMessage.content.split("|")[2].split(">")[1].split("p")[0].trim());
        const carryToDo = nbCarryTotal - nbCarryDone;
        const carryRemaining = nbCarryTotal - (nbCarryDone + carryAmount);
        const pointsPerCarry = pointsTotal / carryToDo;

        if (carryRemaining < 0) {
            return interaction.reply({
                embeds: [{
                    description: `Le nombre de carry renseigné excède le nombre de carry restant.\n*Note: Tout abus du système sera fortement sanctionné !*`,
                    footer: {
                        text: "FrenchLegacy"
                    },
                }],
                ephemeral: true
            })
        }

        // Ajout de points et feedback
        const user = await DB.getUserById(interaction.user.id);
        if (user == null) {
            return interaction.reply({
                embeds: [{
                    description: `Une erreur est survenue lors de la récupération de vos informations`,
                    footer: {
                        text: "FrenchLegacy"
                    },
                }],
                ephemeral: true
            })
        }

        DB.addScoreToUser(user.discordId, carryAmount * pointsPerCarry);

        // Mise à jour du message originel
        await firstMessage.edit({
            content: `${firstMessage.content.split("|")[0]}|${firstMessage.content.split("|")[1]}| ${(nbCarryDone + carryAmount)}/${nbCarryTotal} carry -> ${(carryToDo - carryAmount) * pointsPerCarry} point${(carryToDo - carryAmount) * pointsPerCarry == 1 ? "" : `s`}${carryToDo - carryAmount == 1 ? "" : ` (${pointsPerCarry}/carry)`}`,
            components: [new ActionRowBuilder().addComponents(buttonCloseTicket, buttonClaimTicket.setDisabled(false))]
        })

        await interaction.message.delete();
        await interaction.reply({
            embeds: [{
                description: `<@${user.discordId}> **a effectué ${carryAmount} carry**\n\nNote aux carriers: *Vous devez re-claim ce ticket si vous souhaitez a nouveau faire des carry pour cette personne*`,
                footer: {
                    text: "FrenchLegacy"
                },
            }],
            ephemeral: false
        })

        // Fermer le ticket si tout les carry ont été fait
        if (carryRemaining != 0) {
            return;
        }
        closeTicket(interaction, "carry");

    }

    // Slayer interactions
    else if (interaction.customId == "T3Spider") {
        createCarryChannel(interaction, "T3Spider", 1, roles.roleT3SpiderId, roles.catégorieslayer, "Spider: 70k/unité \nPrix pour (10 ou plus) : 50k/unité", "<:Spider:1081243964755157012>");
    } else if (interaction.customId == "T4Spider") {
        createCarryChannel(interaction, "T4Spider", 3, roles.roleT4SpiderId, roles.catégorieslayer, "Spider T4: 100k/unité \nPrix pour (10 ou plus) : 90k/unité", "<:Spider:1081243964755157012>");
    } else if (interaction.customId == "T4REV") {
        createCarryChannel(interaction, "T4Revenant", 1, roles.roleT4REVId, roles.catégorieslayer, "Zombie T4: 150k/unité \nPrix pour (10 ou plus) : 80k/unité", "<:Revenant:1039706422465794158>");
    } else if (interaction.customId == "T5REV") {
        createCarryChannel(interaction, "T5Revenant", 2, roles.roleT5REVId, roles.catégorieslayer, "Atoned Horror: 200k/unité \nPrix pour (10 ou plus) : 150k/unité", "<:Revenant:1039706422465794158>");
    } else if (interaction.customId == "T3eman") {
        createCarryChannel(interaction, "T3Voidgloom", 6, roles.roleT3emanId, roles.catégorieslayer, "Voidgloom Seraph 3: 800k/unité \nPrix pour (10 ou plus) : 600k/unité", "<:Enderman:1039706047214014464>");
    } else if (interaction.customId == "T4eman") {
        createCarryChannel(interaction, "T4Voidgloom", 10, roles.roleT4emanId, roles.catégorieslayer, "Voidgloom Seraph 4: 2.5m/unité \nPrix pour (10 ou plus) : 2m/unité", "<:Enderman:1039706047214014464>");
    } else if (interaction.customId == "T2blaze") {
        createCarryChannel(interaction, "T2Inferno", 7, roles.roleT2blazeId, roles.catégorieslayer, "Inferno Demonlord 2: 1m/unité \nPrix pour (10 ou plus) : 850k/unité", "<:Blaze:1039705790501617745>");
    } else if (interaction.customId == "T3blaze") {
        createCarryChannel(interaction, "T3Inferno", 15, roles.roleT3blazeId, roles.catégorieslayer, "Inferno Demonlord 3: 2.5m/unité \nPrix pour (10 ou plus) : 2m/unité", "<:Blaze:1039705790501617745>");
    } else if (interaction.customId == "T4blaze") {
        createCarryChannel(interaction, "T4Inferno", 18, roles.roleT4blazeId, roles.catégorieslayer, "Inferno Demonlord 4: 6.5m/unité \nPrix pour (10 ou plus) : 6m/unité", "<:Blaze:1039705790501617745>");
    }

    // Kuudra interactions
    else if (interaction.customId == "k1") {
        createCarryChannel(interaction, "T1Kuudra", 5, roles.roleT1kuudraId, roles.catégoriekuudra, "**Runs**\n- 1 Run: 6m\n- 5 ou plus: 5m unité", "<:Kuudra:1049723520072044614>");
    } else if (interaction.customId == "k2") {
        createCarryChannel(interaction, "T2Kuudra", 8, roles.roleT2kuudraId, roles.catégoriekuudra, "**Runs**\n- 1 Run: 10m\n- 5 ou plus: 8m unité", "<:Kuudra:1049723520072044614>");
    } else if (interaction.customId == "k3") {
        createCarryChannel(interaction, "T3Kuudra", 15, roles.roleT3kuudraId, roles.catégoriekuudra, "**Runs**\n- 1 Run: 15m\n- 5 ou plus: 12.5m unité", "<:Kuudra:1049723520072044614>");
    } else if (interaction.customId == "k4") {
        createCarryChannel(interaction, "T4Kuudra", 20, roles.roleT4kuudraId, roles.catégoriekuudra, "**Runs**\n- 1 Run: 20m\n- 5 ou plus: 17m unité", "<:Kuudra:1049723520072044614>");
    } else if (interaction.customId == "k5") {
        createCarryChannel(interaction, "T5Kuudra", 40, roles.roleT5kuudraId, roles.catégoriekuudra, "**Runs**\n- 1 Run: 60m\n- 5 ou plus: 50m unité", "<:Kuudra:1049723520072044614>");
    }

    // Dungeon interactions
    else if (interaction.customId == "f1") {
        createCarryChannel(interaction, "f1", 1, roles.rolef1Id, roles.catégoriefloor, "**Completion**\n- 1 Run: 90k\n- 5 ou plus: 70k unité\n\n**S Runs**\n- 1 Run: 120k\n- 5 ou plus: 100k unité", "<:Bonzo:1039705817252909147>");
    } else if (interaction.customId == "f2") {
        createCarryChannel(interaction, "f2", 1, roles.rolef2Id, roles.catégoriefloor, "**Completion**\n- 1 Run: 170k\n- 5 ou plus: 150k unité\n\n**S Runs**\n- 1 Run: 250k\n- 5 ou plus: 210k unité", "<:Scarf:1039705859518910634>");
    } else if (interaction.customId == "f3") {
        createCarryChannel(interaction, "f3", 1, roles.rolef3Id, roles.catégoriefloor, "**Completion**\n- 1 Run: 280k\n- 5 ou plus: 260k unité\n\n**S Runs**\n- 1 Run: 350k\n- 5 ou plus: 300k unité", "<:Professor:1039705994768425050>");
    } else if (interaction.customId == "f4") {
        createCarryChannel(interaction, "f4", 2, roles.rolef4Id, roles.catégoriefloor, "**Completion**\n- 1 Run: 400k\n- 5 ou plus: 340k unité\n\n**S Runs**\n- 1 Run: 600k\n- 5 ou plus: 510k unité", "<:Thorn:1039692699625865276>");
    } else if (interaction.customId == "f5") {
        createCarryChannel(interaction, "f5", 1, roles.rolef5Id, roles.catégoriefloor, "**Completion**\n- 1 Run: 350k\n- 5 ou plus: 300k unité\n\n**S Runs**\n- 1 Run: 500k\n- 5 ou plus: 425k unité\n\n**S+ Runs**\n- 1 Run: 800k\n- 5 ou plus: 680k unité", "<:Livid:1039692626665934900>");
    } else if (interaction.customId == "f6") {
        createCarryChannel(interaction, "f6", 3, roles.rolef6Id, roles.catégoriefloor, "**Completion**\n- 1 Run: 600k\n- 5 ou plus: 510k unité\n\n**S Runs**\n- 1 Run: 850k\n- 5 ou plus: 725k unité\n\n**S+ Runs**\n- 1 Run: 1.1m\n- 5 ou plus: 850k unité", "<:Sadan:1039692739488534580>");
    } else if (interaction.customId == "f7") {
        createCarryChannel(interaction, "f7", 5, roles.rolef7Id, roles.catégoriefloor, "**Completion**\n- 1 Run: 4m\n- 5 ou plus: 3.4m unité\n\n**S Runs**\n- 1 Run: 5m\n- 5 ou plus: 6.8m unité\n\n**S+ Runs**\n- 1 Run: 10m\n- 5 ou plus: 8.5m unité", "<:Necron:1040832502417338458>");
    } else if (interaction.customId == "m1") {
        createCarryChannel(interaction, "m1", 4, roles.rolem1Id, roles.catégoriemaster, "**S Runs**\n- 1 Run: 1m\n- 5 ou plus: 850k unité", "<:Bonzo:1039705817252909147>");
    } else if (interaction.customId == "m2") {
        createCarryChannel(interaction, "m2", 8, roles.rolem2Id, roles.catégoriemaster, "**S Runs**\n- 1 Run: 2m\n- 5 ou plus: 1.7m unité", "<:Scarf:1039705859518910634>");
    } else if (interaction.customId == "m3") {
        createCarryChannel(interaction, "m3", 7, roles.rolem3Id, roles.catégoriemaster, "**S Runs**\n- 1 Run: 3m\n- 5 ou plus: 2m unité", "<:Professor:1039705994768425050>");
    } else if (interaction.customId == "m4") {
        createCarryChannel(interaction, "m4", 15, roles.rolem4Id, roles.catégoriemaster, "**Completion**\n- 1 Run: 10m", "<:Thorn:1039692699625865276>");
    } else if (interaction.customId == "m5") {
        createCarryChannel(interaction, "m5", 10, roles.rolem5Id, roles.catégoriemaster, "**S Runs**\n- 1 Run: 4m\n- 5 ou plus: 3.6m unité", "<:Livid:1039692626665934900>");
    } else if (interaction.customId == "m6") {
        createCarryChannel(interaction, "m6", 13, roles.rolem6Id, roles.catégoriemaster, "**S Runs**\n- 1 Run: 6m\n- 5 ou plus: 5.1m unité", "<:Sadan:1039692739488534580>");
    } else if (interaction.customId == "m7") {
        createCarryChannel(interaction, "m7", 20, roles.rolem7Id, roles.catégoriemaster, "**S Runs**\n- 1 Run: 25m\n- 5 ou plus: 21m unité", "<:Necron:1040832502417338458>");
    }
}

function createCarryChannel(interaction, title, points, roleId, categorieId, priceInfo, emote) {
    const roleStaff = interaction.guild.roles.cache.get(config.discord.roles.commandRole);
    const role = interaction.guild.roles.cache.get(roleId);

    const carryAmount = interaction.fields.getTextInputValue('numberOfCarry');
    const ign = interaction.fields.getTextInputValue('ign')

    // Si la valeur renseigné n'est pas un nombre valide
    if (isNaN(carryAmount) || carryAmount < 1) {
        return interaction.reply({
            embeds: [{
                description: `Vous devez renseigner un nombre valide afin de pouvoir créer ce ticket`,
                footer: {
                    text: "FrenchLegacy"
                },
            }],
            ephemeral: true
        })
    }

    // Création du channel de carry
    interaction.guild.channels.create({
        name: `${title} ${interaction.user.username}`,
        type: ChannelType.GuildText,
        topic: `${interaction.user.id}`,
        parent: `${categorieId}`,
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: [PermissionFlagsBits.ViewChannel]
            },
            {
                id: interaction.user.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
            },
            {
                id: roleStaff,
                allow: [PermissionFlagsBits.ViewChannel]
            },
            {
                id: role,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
            }
        ]
    })
    // Envoie des informations sur le carry dans le nouveau channel
    .then((c) => {
        c.send({
            content: `${role} | ${interaction.user} IGN: ${ign} | 0/${carryAmount} carry -> ${points * carryAmount} point${points * carryAmount == 1 ? "" :`s (${points}/carry)`}`,
            embeds: [{
                description: `Informations sur les prix :\n\n${priceInfo}`,
                footer: {
                    text: "FrenchLegacy",
                    iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                },
            }],
            components: [new ActionRowBuilder().addComponents(buttonCloseTicket, buttonClaimTicket.setDisabled(false))]
        })
        interaction.reply({
            content: `${emote} Votre ticket à été ouvert avec succès. <#${c.id}>`,
            ephemeral: true
        })
    })
}

async function closeTicket(interaction, ticketType = null) {
    const channel = interaction.channel;

    const logChannelDefaultService = roles.logChannelDefaultService;
    const logChannelCarrierService = roles.logChannelCarrierService;

    let transcriptsChannel;
    switch (ticketType) {
        case "carry":
        case "carrierrequest":
            transcriptsChannel = interaction.guild.channels.cache.get(logChannelCarrierService);
            break;
        default:
            transcriptsChannel = interaction.guild.channels.cache.get(logChannelDefaultService);
    }

    let msg = await channel.send({ content: "Enregistrement du transcript..." });
    channel.messages.fetch().then(async (messages) => {
        const content = messages
            .reverse()
            .map(
                (m) =>
                    `${new Date(m.createdAt).toLocaleString("en-US")} - ${m.author.tag
                    }: ${m.attachments.size > 0
                        ? m.attachments.first().proxyURL
                        : m.content
                    }`
            )
            .join("\n");

        let transcript = await sourcebin.create(
            [{ name: `${channel.name}`, content: content, languageId: "text" }],
            {
                title: `Transcript: ${channel.name}`,
                description: " ",
            }
        );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setEmoji("📑")
                .setURL(`${transcript.url}`)
        );

        const embed = new EmbedBuilder()
            .setTitle("Ticket Transcript")
            .addFields(
                { name: "Channel", value: `${interaction.channel.name}`, inline: true },
                { name: "Propriétaire du ticket", value: `<@${channel.topic}>`, inline: true },
                { name: "Supprimé par", value: `<@${interaction.user.id}>`, inline: true },
                {
                    name: "Direct Transcript",
                    value: `[Direct Transcript](${transcript.url})`,
                    inline: true,
                }
            )

        await transcriptsChannel.send({ embeds: [embed], components: [row] });
    });

    await msg.edit({
        content: `Transcript enregistrée dans <#${transcriptsChannel.id}>`,
    });

    await channel.send({ content: "Le ticket sera supprimé dans 5 secondes!" });

    setTimeout(async function () {
        channel.delete();
    }, 5000);
}