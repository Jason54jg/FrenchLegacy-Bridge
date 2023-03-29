const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const config = require("../../../config.json");
const Logger = require("../.././Logger.js");
const sourcebin = require("sourcebin_js");
const DB = require("../../../API/database/database.js");

const buttonCloseTicket = new ButtonBuilder()
    .setCustomId('ticket-close')
    .setLabel(' | fermer le ticket')
    .setEmoji("🔒")
    .setStyle(ButtonStyle.Danger);
const buttonClaimTicket = new ButtonBuilder()
    .setCustomId('claim')
    .setLabel(' | Claim')
    .setEmoji('📩')
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

        let logChannelDefaultService = config.discord.roles.logChannelDefaultService;
        let logChannelCarrierService = config.discord.roles.logChannelCarrierService;

        let catégorieslayer = config.discord.roles.catégorieslayer;
        let catégoriefloor = config.discord.roles.catégoriefloor;
        let catégoriemaster = config.discord.roles.catégoriemaster;
        let catégoriecarry = config.discord.roles.catégoriecarry;
        let catégorieticket = config.discord.roles.catégorieticket;
        let catégoriekuudra = config.discord.roles.catégoriekuudra;

        let roleStaff = interaction.guild.roles.cache.get(config.discord.roles.commandRole);
        let f7 = interaction.guild.roles.cache.get(config.discord.roles.rolef7Id);
        let f6 = interaction.guild.roles.cache.get(config.discord.roles.rolef6Id);
        let f5 = interaction.guild.roles.cache.get(config.discord.roles.rolef5Id);
        let f4 = interaction.guild.roles.cache.get(config.discord.roles.rolef4Id);
        let f3 = interaction.guild.roles.cache.get(config.discord.roles.rolef3Id);
        let f2 = interaction.guild.roles.cache.get(config.discord.roles.rolef2Id);
        let f1 = interaction.guild.roles.cache.get(config.discord.roles.rolef1Id);
        let m7 = interaction.guild.roles.cache.get(config.discord.roles.rolem7Id);
        let m6 = interaction.guild.roles.cache.get(config.discord.roles.rolem6Id);
        let m5 = interaction.guild.roles.cache.get(config.discord.roles.rolem5Id);
        let m4 = interaction.guild.roles.cache.get(config.discord.roles.rolem4Id);
        let m3 = interaction.guild.roles.cache.get(config.discord.roles.rolem3Id);
        let m2 = interaction.guild.roles.cache.get(config.discord.roles.rolem2Id);
        let m1 = interaction.guild.roles.cache.get(config.discord.roles.rolem1Id);
        let T3Spider = interaction.guild.roles.cache.get(config.discord.roles.roleT3SpiderId);
        let T4Spider = interaction.guild.roles.cache.get(config.discord.roles.roleT4SpiderId);
        let T4REV = interaction.guild.roles.cache.get(config.discord.roles.roleT4REVId);
        let T5REV = interaction.guild.roles.cache.get(config.discord.roles.roleT5REVId);
        let T3eman = interaction.guild.roles.cache.get(config.discord.roles.roleT3emanId);
        let T4eman = interaction.guild.roles.cache.get(config.discord.roles.roleT4emanId);
        let T2blaze = interaction.guild.roles.cache.get(config.discord.roles.roleT2blazeId);
        let T3blaze = interaction.guild.roles.cache.get(config.discord.roles.roleT3blazeId);
        let T4blaze = interaction.guild.roles.cache.get(config.discord.roles.roleT4blazeId);
        let T1kuudra = interaction.guild.roles.cache.get(config.discord.roles.roleT1kuudraId);
        let T2kuudra = interaction.guild.roles.cache.get(config.discord.roles.roleT2kuudraId);
        let T3kuudra = interaction.guild.roles.cache.get(config.discord.roles.roleT3kuudraId);
        let T4kuudra = interaction.guild.roles.cache.get(config.discord.roles.roleT4kuudraId);
        let T5kuudra = interaction.guild.roles.cache.get(config.discord.roles.roleT5kuudraId);

        let DejaUnChannel = interaction.guild.channels.cache.find(c => c.topic == interaction.user.id);

        if (interaction.customId.contains("ticket-close")) {
            const channel = interaction.channel;
            const member = interaction.guild.members.cache.get(channel.topic);
            const requestId = interaction.customId.split("-")[2];
          
            const rowPanel = new ActionRowBuilder().addComponents(buttonCloseTicket);

            await interaction.message.edit({ components: [rowPanel] });



            const rowDeleteFalse = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setEmoji("🗑️")
                .setDisabled(true)
            );

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
        }
        else if (interaction.customId === "claim") {
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
            if (! interaction.member._roles.includes(interaction.message.content.split('&')[1].split('>')[0])) {
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

            // S'il s'agit bien d'un ticket lié a un carry (qui rapporte des points)
            // note: pas la meilleur facon de vérifier, mais fonctionnelle pour le moment
            if (interaction.message.content.split('|')[2] != null) {
                // Création d'un formulaire pour renseigner le nombre de carry a effectuer
                const modal = new ModalBuilder()
                    .setCustomId('carry-amount')
                    .setTitle('Combien de carry devez-vous effectuer ?')

                const nbCarryInput = new TextInputBuilder()
                    .setCustomId('numberOfCarry')
                    .setLabel("Entrez le nombre de carry a effectuer")
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(4)
                    .setMinLength(1)
                    .setPlaceholder('Exemple: 1, 2, 5, ...')
                    .setValue('1');

                const nbCarryRow = new ActionRowBuilder().addComponents(nbCarryInput);
                modal.addComponents(nbCarryRow);
                await interaction.showModal(modal);
            }
        }

        else if (interaction.customId.contains("ticket-delete") && interaction.channel.name.includes("fermer")) {
            const channel = interaction.channel;
            const member = interaction.guild.members.cache.get(channel.topic);

            let transcriptsChannel;
            switch (interaction.customId.split("-")[2]) {
                case "carrierrequest":
                    transcriptsChannel = interaction.guild.channels.cache.get(logChannelCarrierService);
                    break;
                default:
                    transcriptsChannel = interaction.guild.channels.cache.get(logChannelDefaultService);
            }

            const rowCloseFalse = new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setEmoji("🗑️")
                .setDisabled(true)

            interaction.message.edit({ components: [new ActionRowBuilder().addComponents(rowCloseFalse)] });

            interaction.deferUpdate();

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
        else if (interaction.customId == "f1") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `f1 ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégoriefloor}`,
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
                        id: f1,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${f1} | ${interaction.user} | 1 points`,
                    embeds: [{
                        description: "Veuillez indiquer votre IGN, l'étage du carry, le nombre de carry que vous souhaitez et le score que vous souhaitez.\n\nInformations sur les prix :\n\n**Completion**\n- 1 Run: 90k\n- 5 ou plus: 70k unité\n\n**S Runs**\n- 1 Run: 120k\n- 5 ou plus: 100k unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Professor:1039705994768425050> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        }
        else if (interaction.customId == "f2") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `f2 ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégoriefloor}`,
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
                        id: f2,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${f2} | ${interaction.user} | 1 points`,
                    embeds: [{
                        description: "Veuillez indiquer votre IGN, l'étage du carry, le nombre de carry que vous souhaitez et le score que vous souhaitez.\n\nInformations sur les prix :\n\n**Completion**\n- 1 Run: 170k\n- 5 ou plus: 150k unité\n\n**S Runs**\n- 1 Run: 250k\n- 5 ou plus: 210k unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Scarf:1039705859518910634> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        }
        else if (interaction.customId == "f3") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `f3 ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégoriefloor}`,
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
                        id: f3,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${f3} | ${interaction.user} | 1 points`,
                    embeds: [{
                        description: "Veuillez indiquer votre IGN, l'étage du carry, le nombre de carry que vous souhaitez et le score que vous souhaitez.\n\nInformations sur les prix :\n\n**Completion**\n- 1 Run: 280k\n- 5 ou plus: 260k unité\n\n**S Runs**\n- 1 Run: 350k\n- 5 ou plus: 300k unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Professor:1039705994768425050> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        }
        else if (interaction.customId == "f4") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `f4 ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégoriefloor}`,
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
                        id: f4,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${f4} | ${interaction.user} | 2 points`,
                    embeds: [{
                        description: "Veuillez indiquer votre IGN, l'étage du carry, le nombre de carry que vous souhaitez et le score que vous souhaitez.\n\nInformations sur les prix :\n\n**Completion**\n- 1 Run: 400k\n- 5 ou plus: 340k unité\n\n**S Runs**\n- 1 Run: 600k\n- 5 ou plus: 510k unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Thorn:1039692699625865276> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        }
        else if (interaction.customId == "f5") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `f5 ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégoriefloor}`,
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
                        id: f5,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${f5} | ${interaction.user} | 1 point`,
                    embeds: [{
                        description: "Veuillez indiquer votre IGN, l'étage du carry, le nombre de carry que vous souhaitez et le score que vous souhaitez.\n\nInformations sur les prix :\n\n**Completion**\n- 1 Run: 350k\n- 5 ou plus: 300k unité\n\n**S Runs**\n- 1 Run: 500k\n- 5 ou plus: 425k unité\n\n**S+ Runs**\n- 1 Run: 800k\n- 5 ou plus: 680k unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Livid:1039692626665934900> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "f6") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `f6 ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégoriefloor}`,
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
                        id: f6,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${f6} | ${interaction.user} | 3 points`,
                    embeds: [{
                        description: "Veuillez indiquer votre IGN, l'étage du carry, le nombre de carry que vous souhaitez et le score que vous souhaitez.\n\nInformations sur les prix :\n\n**Completion**\n- 1 Run: 600k\n- 5 ou plus: 510k unité\n\n**S Runs**\n- 1 Run: 850k\n- 5 ou plus: 725k unité\n\n**S+ Runs**\n- 1 Run: 1.1m\n- 5 ou plus: 850k unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Sadan:1039692739488534580> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "f7") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `f7 ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégoriefloor}`,
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
                        id: f7,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${f7} | ${interaction.user} | 5 points`,
                    embeds: [{
                        description: "Veuillez indiquer votre IGN, l'étage du carry, le nombre de carry que vous souhaitez et le score que vous souhaitez.\n\nInformations sur les prix :\n\n**Completion**\n- 1 Run: 4m\n- 5 ou plus: 3.4m unité\n\n**S Runs**\n- 1 Run: 5m\n- 5 ou plus: 6.8m unité\n\n**S+ Runs**\n- 1 Run: 10m\n- 5 ou plus: 8.5m unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Necron:1040832502417338458> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "m1") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `m1 ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégoriemaster}`,
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
                        id: m1,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${m1} | ${interaction.user} | 4 points`,
                    embeds: [{
                        description: "Veuillez indiquer votre IGN, l'étage du carry, le nombre de carry que vous souhaitez et le score que vous souhaitez.\n\nInformations sur les prix :\n\n**S Runs**\n- 1 Run: 1m\n- 5 ou plus: 850k unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Bonzo:1039705817252909147> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "m2") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `m2 ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégoriemaster}`,
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
                        id: m2,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${m2} | ${interaction.user} | 8 points`,
                    embeds: [{
                        description: "Veuillez indiquer votre IGN, l'étage du carry, le nombre de carry que vous souhaitez et le score que vous souhaitez.\n\nInformations sur les prix :\n\n**S Runs**\n- 1 Run: 2m\n- 5 ou plus: 1.7m unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Scarf:1039705859518910634> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "m3") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `m3 ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégoriemaster}`,
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
                        id: m3,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${m3} | ${interaction.user} | 7 points`,
                    embeds: [{
                        description: "Veuillez indiquer votre IGN, l'étage du carry, le nombre de carry que vous souhaitez et le score que vous souhaitez.\n\nInformations sur les prix :\n\n**S Runs**\n- 1 Run: 3m\n- 5 ou plus: 2m unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Professor:1039705994768425050> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "m4") {
            if (DejaUnChannel) return interaction.reply({content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true})
                interaction.guild.channels.create({
                    name: `m4 ${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    topic: `${interaction.user.id}`,
                    parent: `${catégoriemaster}`,
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
                            id: m4,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                        }
                    ]
                }).then((c)=>{
                c.send({
                    content: `${m4} | ${interaction.user} | 15 points`,
                    embeds: [{
                        description: "Veuillez indiquer votre IGN, l'étage du carry, le nombre de carry que vous souhaitez et le score que vous souhaitez.\n\nInformations sur les prix :\n\n**Completion**\n- 1 Run: 10m",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Thorn:1039692699625865276> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "m5") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `m5 ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégoriemaster}`,
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
                        id: m5,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${m5} | ${interaction.user} | 10 points`,
                    embeds: [{
                        description: "Veuillez indiquer votre IGN, l'étage du carry, le nombre de carry que vous souhaitez et le score que vous souhaitez.\n\nInformations sur les prix :\n\n**S Runs**\n- 1 Run: 4m\n- 5 ou plus: 3.6m unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Livid:1039692626665934900> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "m6") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `m6 ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégoriemaster}`,
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
                        id: m6,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${m6} | ${interaction.user} | 13 points`,
                    embeds: [{
                        description: "Veuillez indiquer votre IGN, l'étage du carry, le nombre de carry que vous souhaitez et le score que vous souhaitez.\n\nInformations sur les prix :\n\n**S Runs**\n- 1 Run: 6m\n- 5 ou plus: 5.1m unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Sadan:1039692739488534580> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "m7") {
            if (DejaUnChannel) return interaction.reply({content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true})
                interaction.guild.channels.create({
                    name: `m7 ${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    topic: `${interaction.user.id}`,
                    parent: `${catégoriemaster}`,
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
                            id: m7,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                        }
                    ]
                }).then((c)=>{
                c.send({
                    content: `${m7} | ${interaction.user} | 20 points`,
                    embeds: [{
                        description: "Veuillez indiquer votre IGN, l'étage du carry, le nombre de carry que vous souhaitez et le score que vous souhaitez.\n\nInformations sur les prix :\n\n**S Runs**\n- 1 Run: 25m\n- 5 ou plus: 21m unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Necron:1040832502417338458> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "T3Spider") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `T3Spider ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégorieslayer}`,
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
                        id: T3Spider,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${T3Spider} | ${interaction.user} | 1 point`,
                    embeds: [{
                        description: "Veuillez indiquer les éléments suivants :\n- Votre IGN\n- Le nombre de boss que vous voulez passer\n\nInformations sur les prix :\n\nSpider: 70k/unité\nPrix pour (10 ou plus) : 50k/unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Spider:1081243964755157012> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "T4Spider") {
              if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
              interaction.guild.channels.create({
                  name: `T4Spider ${interaction.user.username}`,
                  type: ChannelType.GuildText,
                  topic: `${interaction.user.id}`,
                  parent: `${catégorieslayer}`,
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
                          id: T4Spider,
                          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                      }
                  ]
              }).then((c) => {
                  c.send({
                      content: `${T4Spider} | ${interaction.user} | 3 point`,
                      embeds: [{
                          description: "Veuillez indiquer les éléments suivants :\n- Votre IGN\n- Le nombre de boss que vous voulez passer\n\nInformations sur les prix :\n\nSpider T4: 100k/unité\nPrix pour (10 ou plus) : 90k/unité",
                          footer: {
                              text: "FrenchLegacy",
                              iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                          },
                      }],
                      components: [
                          new ActionRowBuilder()
                              .addComponents(buttonCloseTicket, buttonClaimTicket)
                      ]
                  })
                  interaction.reply({
                      content: `<:Spider:1081243964755157012> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                      ephemeral: true
                  })
              })
          } else if (interaction.customId == "T4REV") {
          if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
          interaction.guild.channels.create({
              name: `T4Revenant ${interaction.user.username}`,
              type: ChannelType.GuildText,
              topic: `${interaction.user.id}`,
              parent: `${catégorieslayer}`,
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
                      id: T4REV,
                      allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                  }
              ]
          }).then((c) => {
              c.send({
                  content: `${T4REV} | ${interaction.user} | 1 point`,
                  embeds: [{
                      description: "Veuillez indiquer les éléments suivants :\n- Votre IGN\n- Le nombre de boss que vous voulez passer\n\nInformations sur les prix :\n\nZombie T4: 150k/unité\nPrix pour (10 ou plus) : 80k/unité",
                      footer: {
                          text: "FrenchLegacy",
                          iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                      },
                  }],
                  components: [
                      new ActionRowBuilder()
                          .addComponents(buttonCloseTicket, buttonClaimTicket)
                  ]
              })
              interaction.reply({
                  content: `<:Revenant:1039706422465794158> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                  ephemeral: true
              })
          })
      } else if (interaction.customId == "T5REV") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `T5Revenant ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégorieslayer}`,
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
                        id: T5REV,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${T5REV} | ${interaction.user} | 2 point`,
                    embeds: [{
                        description: "Veuillez indiquer les éléments suivants :\n- Votre IGN\n- Le nombre de boss que vous voulez passer\n\nInformations sur les prix :\n\nAtoned Horror: 200k/unité\nPrix pour (10 ou plus) : 150k/unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Revenant:1039706422465794158> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "T3eman") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `T3Voidgloom ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégorieslayer}`,
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
                        id: T3eman,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${T3eman} | ${interaction.user} | 6 points`,
                    embeds: [{
                        description: "Veuillez indiquer les éléments suivants :\n- Votre IGN\n- Le nombre de boss que vous voulez passer\n\nInformations sur les prix :\n\nVoidgloom Seraph 3: 800k/unité\nPrix T3 pour (10 ou plus) : 600k/unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Enderman:1039706047214014464> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "T4eman") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `T4Voidgloom ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégorieslayer}`,
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
                        id: T4eman,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${T4eman} | ${interaction.user} | 10 points`,
                    embeds: [{
                        description: "Veuillez indiquer les éléments suivants :\n- Votre IGN\n- Le nombre de boss que vous voulez passer\n\nInformations sur les prix :\n\nVoidgloom Seraph 4: 2.5m/unité\nPrix T4 pour (10 ou plus) : 2m/unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Enderman:1039706047214014464> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "T2blaze") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `T2Inferno ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégorieslayer}`,
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
                        id: T2blaze,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${T2blaze} | ${interaction.user} | 7 points`,
                    embeds: [{
                        description: "Veuillez indiquer les éléments suivants :\n- Votre IGN\n- Le nombre de boss que vous voulez passer\n\nInformations sur les prix :\n\nInferno Demonlord 2: 1m/ pour (10+) 850k/unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Blaze:1039705790501617745> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "T3blaze") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `T3Inferno ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégorieslayer}`,
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
                        id: T3blaze,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${T3blaze} | ${interaction.user} | 15 points`,
                    embeds: [{
                        description: "Veuillez indiquer les éléments suivants :\n- Votre IGN\n- Le nombre de boss que vous voulez passer\n\nInformations sur les prix :\n\nInferno Demonlord 3: 2.5m/ pour (10+) 2m/unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Blaze:1039705790501617745> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "T4blaze") {
            if (DejaUnChannel) return interaction.reply({content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true})
                interaction.guild.channels.create({
                    name: `T4Inferno ${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    topic: `${interaction.user.id}`,
                    parent: `${catégorieslayer}`,
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
                            id: T4blaze,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                        }
                    ]
                }).then((c)=>{
                c.send({
                    content: `${T4blaze} | ${interaction.user} | 18 points`,
                    embeds: [{
                        description: "Veuillez indiquer les éléments suivants :\n- Votre IGN\n- Le nombre de boss que vous voulez passer\n\nInformations sur les prix :\n\nInferno Demonlord 4: 6.5m /pour (10+) 6m/unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Blaze:1039705790501617745> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
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
        } else if (interaction.customId == "k1") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `T1Kuudra ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégoriekuudra}`,
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
                        id: T1kuudra,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${T1kuudra} | ${interaction.user} | 5 points`,
                    embeds: [{
                        description: "Veuillez indiquer les éléments suivants :\n- Votre IGN\n- Le nombre de run que vous voulez passer\n\nInformations sur les prix :\n\n**Runs**\n- 1 Run: 6m\n- 5 ou plus: 5m unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Kuudra:1049723520072044614> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "k2") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `T2Kuudra ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégoriekuudra}`,
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
                        id: T2kuudra,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${T2kuudra} | ${interaction.user} | 8 points`,
                    embeds: [{
                        description: "Veuillez indiquer les éléments suivants :\n- Votre IGN\n- Le nombre de run que vous voulez passer\n\nInformations sur les prix :\n\n**Runs**\n- 1 Run: 10m\n- 5 ou plus: 8m unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Kuudra:1049723520072044614> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "k3") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `T3Kuudra ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégoriekuudra}`,
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
                        id: T3kuudra,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${T3kuudra} | ${interaction.user} | 15 points`,
                    embeds: [{
                        description: "Veuillez indiquer les éléments suivants :\n- Votre IGN\n- Le nombre de run que vous voulez passer\n\nInformations sur les prix :\n\n**Runs**\n- 1 Run: 15m\n- 5 ou plus: 12.5m unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Kuudra:1049723520072044614> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "k4") {
            if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
            interaction.guild.channels.create({
                name: `T4Kuudra ${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `${interaction.user.id}`,
                parent: `${catégoriekuudra}`,
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
                        id: T4kuudra,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then((c) => {
                c.send({
                    content: `${T4kuudra} | ${interaction.user} | 20 points`,
                    embeds: [{
                        description: "Veuillez indiquer les éléments suivants :\n- Votre IGN\n- Le nombre de run que vous voulez passer\n\nInformations sur les prix :\n\n**Runs**\n- 1 Run: 20m\n- 5 ou plus: 17m unité",
                        footer: {
                            text: "FrenchLegacy",
                            iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                        },
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket, buttonClaimTicket)
                    ]
                })
                interaction.reply({
                    content: `<:Kuudra:1049723520072044614> Votre ticket à été ouvert avec succès. <#${c.id}>`,
                    ephemeral: true
                })
            })
        } else if (interaction.customId == "k5") {
              if (DejaUnChannel) return interaction.reply({ content: 'Vous avez déja un ticket d\'ouvert sur le serveur.', ephemeral: true })
              interaction.guild.channels.create({
                  name: `T5Kuudra ${interaction.user.username}`,
                  type: ChannelType.GuildText,
                  topic: `${interaction.user.id}`,
                  parent: `${catégoriekuudra}`,
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
                          id: T5kuudra,
                          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
                      }
                  ]
              }).then((c) => {
                  c.send({
                      content: `${T5kuudra} | ${interaction.user} | 40 points`,
                      embeds: [{
                          description: "Veuillez indiquer les éléments suivants :\n- Votre IGN\n- Le nombre de run que vous voulez passer\n\nInformations sur les prix :\n\n**Runs**\n- 1 Run: 60m\n- 5 ou plus: 50m unité",
                          footer: {
                              text: "FrenchLegacy",
                              iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"
                          },
                      }],
                      components: [
                          new ActionRowBuilder()
                              .addComponents(buttonCloseTicket, buttonClaimTicket)
                      ]
                  })
                  interaction.reply({
                      content: `<:Kuudra:1049723520072044614> Votre ticket à été ouvert avec succès. <#${c.id}>`,
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
    if (interaction.customId === 'carry-amount') {
        const carryAmount = interaction.fields.getTextInputValue('numberOfCarry');
        const points = parseInt(interaction.message.content.split('|')[2].split('p')[0].trim(), 10);
        // Si la valeur renseigné n'est pas un nombre
        if (isNaN(carryAmount)) {
            return interaction.reply({
                embeds: [{
                    description: `Vous devez renseigner un nombre afin de pouvoir prendre ce ticket en charge`,
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

        DB.addScoreToUser(user.discordId, carryAmount * points);
        await interaction.message.edit({
                    components: [
                        new ActionRowBuilder()
                            .addComponents(buttonCloseTicket)
                    ]
                });
        interaction.reply({
            embeds: [{
                description: `Votre salon a été pris en charge par ${interaction.user} pour ${carryAmount} carry`,
                footer: {
                    text: "FrenchLegacy"
                },
            }]
        })
    }
    
}