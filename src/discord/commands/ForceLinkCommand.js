const config = require ('../../../config.json');
const { EmbedBuilder } = require("discord.js");
const { writeAt } = require('../../contracts/helperFunctions');
const { getUUID } = require('../../contracts/API/PlayerDBAPI');
const messages = require('../../../messages.json');

module.exports = {
    name: 'forcelink',
    description: 'Connectez votre compte Discord à Minecraft Commande admin',
    options: [
      {
        name: 'name',
        description: 'Pseudo Minecraft',
        type: 3,
        required: true
      },
      {
        name: 'utilisateur',
        description: 'Pseudo Discord',
        type: 6,
        required: true
      }
    ],

    execute: async (interaction, client) => {
        try {
        // Si l'utilisateur n'a pas la permission d'utiliser la commande
        if (!(await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole)) {
            return await interaction.reply({
                content: `${messages.permissionInsuffisante}`,
                ephemeral: true,
            });
        }
        const username = interaction.options.getString("name");
        const id = interaction.options._hoistedOptions[1].value
        (await interaction.guild.members.fetch(id)).roles.add(interaction.guild.roles.cache.get(config.discord.roles.linkedRole))

        const uuid = await getUUID(username)
        await writeAt('data/discordLinked.json', `${id}.data`, [`${uuid}`])
        await writeAt('data/minecraftLinked.json', `${uuid}.data`, [`${id}`])
        const successfullyLinked = new EmbedBuilder()
            .setAuthor({ name: 'Lié avec succès!'})
            .setDescription(`\`${username}\` a été lié avec succès à \`${(await interaction.guild.members.fetch(id)).user.username}#${(await interaction.guild.members.fetch(id)).user.discriminator}\``)
            .setFooter({ text: `${messages.footerhelp}`, iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png` });
        await interaction.reply({ embeds: [successfullyLinked] });

        } catch(error) {
            const errorEmbed = new EmbedBuilder()
                .setAuthor({ name: `Une erreur s'est produite`})
                .setDescription(error)
                .setFooter({ text: `${messages.footerhelp}`, iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png` });
            interaction.reply({ embeds: [errorEmbed] });
        }
    }
};