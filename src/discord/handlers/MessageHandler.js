const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const { demojify } = require("discord-emoji-converter");
const config = require("../../../config.json");

class MessageHandler {
  constructor(discord, command) {
    this.discord = discord;
    this.command = command;
  }
  async react_to_msg(msg, emojis) {
    for (let i = 0; i < emojis.length; i++) {
      await msg.react(emojis[i]);
    }
  }
  async onMessage(message) {
    const autochannel = config.discord.AutoreactChannel.channel;
    const emoji = config.discord.AutoreactChannel.emojis;
    let id = message.channel.id;
    for (let i = 0; i < autochannel.length; i++) {
      if (autochannel[i] == id) {
        this.react_to_msg(message, emoji[i]);
      }
    }
    try {
      const messageData = {
        member: "",
        channel: "",
        username: "",
        message: "",
        replyingTo: "",
      }
      console.log(message.webhookID)
      if (message.author.id === config.discord.bot.webhookid){
        console.log(message)
        const tag = config.discord.bot.tag
        const webhook = await message.channel.fetchWebhooks();
        if (webhook.size>0){
          const firstWebhook = webhook.first()

          const webhookUsername = firstWebhook.name
          if (webhookUsername.includes(tag2)){
            messageData.channel = message.channel.id
            messageData.username = webhookUsername.replace(tag,"")
            messageData.message = firstWebhook.cleanContent
          }
        }
      }
      else{
        if (message.author.id === client.user.id || !this.shouldBroadcastMessage(message)) {
          return;
        }

        const content = this.stripDiscordContent(message).trim();
        if (content.length === 0) {
          return;
        }

        messageData.member = message.member.user
        messageData.channel = message.channel.id
        messageData.username = message.member.displayName
        messageData.message = content
        messageData.replyingTo = await this.fetchReply(message)
      

      const images = content.split(" ").filter((line) => line.startsWith("http"));
      for (const attachment of message.attachments.values()) {
        images.push(attachment.url);
      }

      if (images.length > 0) {
        for (const attachment of images) {
          const imgurLink = await uploadImage(attachment);

          messageData.message = messageData.message.replace(attachment, imgurLink.data.link);

          if (messageData.message.includes(imgurLink.data.link) === false) {
            messageData.message += ` ${imgurLink.data.link}`;
          }
        }
      }
      }
      if (messageData.message.length === 0) return;

      this.discord.broadcastMessage(messageData);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchReply(message) {
    try {
      if (message.reference === undefined) return null;

      const reference = await message.channel.messages.fetch(
        message.reference.messageId
      );

      const mentionedUserName = message?.mentions?.repliedUser?.username;
      if (config.discord.other.messageMode === "bot") {
        const embedAuthorName = reference?.embeds?.[0]?.author?.name;

        return embedAuthorName ?? mentionedUserName;
      }

      if (config.discord.other.messageMode === "minecraft") {
        const attachmentName = reference?.attachments?.values()?.next()
          ?.value?.name;

        return attachmentName
          ? attachmentName.split(".")[0]
          : mentionedUserName;
      }

      if (config.discord.other.messageMode === "webhook") {
        return reference.author.username ?? mentionedUserName;
      }
    } catch (error) {
      return null;
    }
  }

  stripDiscordContent(message) {
    let output = message.content
      .split("\n")
      .map((part) => {
        part = part.trim();
        return part.length === 0
          ? ""
          : part.replace(/@(everyone|here)/gi, "").trim() + " ";
      })
      .join("");

    const hasMentions = /<@|<#|<:|<a:/.test(message);
    if (hasMentions) {
      const userMentionPattern = /<@(\d+)>/g;
      const replaceUserMention = (match, mentionedUserId) => {
        const mentionedUser = message.guild.members.cache.get(mentionedUserId);

        return `@${mentionedUser.displayName}`;
      };
      output = output.replace(userMentionPattern, replaceUserMention);

      const channelMentionPattern = /<#(\d+)>/g;
      const replaceChannelMention = (match, mentionedChannelId) => {
        const mentionedChannel =
          message.guild.channels.cache.get(mentionedChannelId);

        return `#${mentionedChannel.name}`;
      };
      output = output.replace(channelMentionPattern, replaceChannelMention);

      const emojiMentionPattern = /<a?:(\w+):\d+>/g;
      output = output.replace(emojiMentionPattern, ":$1:");
    }

    // Replace IP Adresses with [IP Address Removed]
    const IPAddressPattern = /(?:\d{1,3}\s*\s\s*){3}\d{1,3}/g;
    output = output.replaceAll(IPAddressPattern, "[IP Address Removed]");

    // ? La fonction demojify() a un bogue. Il génère une erreur lorsqu'il rencontre un canal avec emoji dans son nom. Exemple: #💬・chat-de-guilde
    try {
      return demojify(output);
    } catch (e) {
      return output;
    }
  }

  shouldBroadcastMessage(message) {
    const isValid = !message.author.bot && message.content.length > 0;
    const validChannelIds = [
      config.discord.channels.officerChannel,
      config.discord.channels.guildChatChannel,
      config.discord.channels.debugChannel,
    ];

    return isValid && validChannelIds.includes(message.channel.id);
  }
}

module.exports = MessageHandler;
