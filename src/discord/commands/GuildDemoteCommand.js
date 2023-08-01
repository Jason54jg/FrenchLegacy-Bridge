const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const messages = require("../../../messages.json");

module.exports = {
  name: "gdemote",
  description: "Rétrograde l'utilisateur donné d'un rang de guilde.",
  options: [
    {
      name: "name",
      description: "Pseudo Minecraft",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const user = interaction.member;
    if (user.roles.cache.has(config.discord.roles.commandRole) === false) {
      throw new Error("Vous n'êtes pas autorisé à utiliser cette commande.");
    }

    const name = interaction.options.getString("name");
    bot.chat(`/g demote ${name}`);

    const embed = new EmbedBuilder()
      .setAuthor({ name: "Demote" })
      .setDescription(`Exécuté avec succès \`/g demote ${name}\`\nRegarde dans <#1014148236132483112>`)
      .setFooter({
        text: `${messages.footerhelp}`,
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });
    await interaction.followUp({
      embeds: [embed],
    });
  },
};
