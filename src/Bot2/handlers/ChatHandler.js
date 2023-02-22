const { replaceAllRanks, toFixed, addCommas } = require('../../contracts/helperFunctions.js')
const { getLatestProfile } = require('../../../API/functions/getLatestProfile.js')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
let guildInfo = [], guildRanks = [], members = [], guildTop = []
const hypixel = require('../../contracts/API/HypixelRebornAPI.js')
const { getUUID } = require('../../contracts/API/PlayerDBAPI.js')
const eventHandler = require('../../contracts/EventHandler.js')
const getWeight = require('../../../API/stats/weight.js')
const messages = require('../../../messages.json')
const { WebhookClient, EmbedBuilder } = require('discord.js')
const config = require('../../../config.json')
const Logger = require('../../Logger.js')
const fs = require('fs')
const motds = require('./motd.json')

const Joueur = new WebhookClient({ id: config.discord.Bot2WebhookId, token: config.discord.Bot2WebhookToken });

class StateHandler extends eventHandler {
  constructor(minecraft, command, discord) {
    super()
    this.minecraft = minecraft
    this.discord = discord
    this.command = command
  }

  registerEvents(bot) {
    this.bot = bot
    this.bot.on('message', (message) => this.onMessage(message))
  }

  async onMessage(event) {
    const message = event.toString().trim();
    const colouredMessage = event.toMotd();

    if (this.isLimboJoinMessage(message)) {
      return setTimeout(() => bot.chat("/lobby"), 1000);
    }

    if (this.isSkyBlockJoinMessage(message)) {
      await delay(3000)
      this.send(`/skyblock`)
    }

    if (this.isBugServerMessage(message)) {
        Joueur.send({
            content: `Problème de connexion au serveur (${bot.username})`,
            avatarURL: `https://minotar.net/helm/${bot.username}/100.png`,
            username: `${bot.username}`
        });
      await delay(70000)
      this.send(`/skyblock`)
      await delay(80000)
      this.send(`/is`)
    }

    if (this.isRestartServerMessage(message)) {
        Joueur.send({
            content: `[Important] Ce serveur va bientôt redémarrer: Redémarrage planifié (${bot.username})`,
            avatarURL: `https://minotar.net/helm/${bot.username}/100.png`,
            username: `${bot.username}`
        });
      await delay(70000)
      this.send(`/skyblock`)
      await delay(80000)
      this.send(`/is`)
    }

    if (this.isGameUpdateMessage(message)) {
        Joueur.send({
            content: `Ce serveur va bientôt redémarrer: mise à jour du jeu (${bot.username})`,
            avatarURL: `https://minotar.net/helm/${bot.username}/100.png`,
            username: `${bot.username}`
        });
      await delay(40000)
      this.send(`/skyblock`)
      await delay(42000)
      this.send(`/is`)
    }

    if (this.isKickServerMessage(message)) {
        Joueur.send({
            content: `Évacuation vers le hub (${bot.username})`,
            avatarURL: `https://minotar.net/helm/${bot.username}/100.png`,
            username: `${bot.username}`
        });
      await delay(10000)
      this.send(`/is`)
    }

    if (this.isSwitchServerMessage(message)) {
      await delay(10000)
      this.send(`/is`)
    }

    if (this.isBugServerMessage(message)) {
      await delay(70000)
      this.send(`/skyblock`)
      await delay(80000)
      this.send(`/is`)
    }

    if (this.isRestartServerMessage(message)) {
      await delay(70000)
      this.send(`/skyblock`)
      await delay(80000)
      this.send(`/is`)
    }

    if (this.isGameUpdateMessage(message)) {
      await delay(40000)
      this.send(`/skyblock`)
      await delay(42000)
      this.send(`/is`)
    }

    if (this.isKickServerMessage(message)) {
      await delay(10000)
      this.send(`/is`)
    }

    if (this.isSwitchServerMessage(message)) {
      await delay(10000)
      this.send(`/is`)
    }


    if (this.isGuildLoginMessage(message)) {
      let user = message.split('>')[1].trim().split('joined.')[0].trim()
      let motd = motds[Math.floor(Math.random() * motds.length)];

      return setTimeout(() => {
        this.bot.chat(`/msg ${user} ${motd.slice(0, 80)}`)
        if (motd.slice(80, 160)) {
          setTimeout(() => { this.bot.chat(`/msg ${user} ${motd.slice(80, 160)}`) }, 700)
        }
        if (motd.slice(160, 240)) {
          setTimeout(() => { this.bot.chat(`/msg ${user} ${motd.slice(160, 240)}`) }, 1400)
        }
        if (motd.slice(240, 320)) {
          setTimeout(() => { this.bot.chat(`/msg ${user} ${motd.slice(240, 320)}`) }, 2100)
        }
        if (motd.slice(320, 400)) {
          setTimeout(() => { this.bot.chat(`/msg ${user} ${motd.slice(320, 400)}`) }, 2800)
        }
        if (motd.slice(400, 480)) {
          setTimeout(() => { this.bot.chat(`/msg ${user} ${motd.slice(400, 480)}`) }, 3500)
        }
      }, 1000);

    }

    if (this.isGuildTopMessage(message)) {
      if (!message.includes('10.')) {
        guildTop.push(message)
      } else {
        guildTop.push(message)
        let description = '', guildTopInfo = []
        for (let i = 1; i < guildTop.length; i++) {
          guildTop[i] = replaceAllRanks(guildTop[i])
          guildTopInfo = guildTop[i].split(' ')
          description = `${description}\n${guildTopInfo[0]} \`${guildTopInfo[1]}\` ${guildTopInfo[2]} ${guildTopInfo[3]} ${guildTopInfo[4]}`
        }

        this.minecraft.broadcastHeadedEmbed({
          message: `${description}`,
          title: 'Top Guild Experience',
          color: 2067276,
          channel: 'Guild'
        })
        guildTop = [], guildTopInfo = [], description = ''
      }
    }

    if (this.isRequestMessage(message)) {
      const username = replaceAllRanks(message.split('has')[0].replaceAll('-----------------------------------------------------\n', ''))
      const uuid = await getUUID(username);
      if (config.guildRequirement.enabled) {
        const [player, profile] = await Promise.all([
          hypixel.getPlayer(uuid),
          getLatestProfile(uuid)
        ])
        let meetRequirements = false;

        const weight = (await getWeight(profile.profile, profile.uuid)).weight.senither.total

        if (weight > config.guildRequirement.requirements.senitherWeight) meetRequirements = true;

        bot.chat(`/oc ${username} ${meetRequirements ? 'Does' : 'Doesn\'t'} meet Requirements. Skyblock: ${weight}`)

        if (meetRequirements) {
          const statsEmbed = new EmbedBuilder()
            .setColor(2067276)
            .setTitle(`${player.nickname} a demandé à rejoindre la guilde!`)
            .setDescription(`**Hypixel Network Level**\n${player.level}\n`)
            .addFields({ name: 'Senither Weight', value: `${addCommas(toFixed((weight), 2))}`, inline: true },
            )
            .setThumbnail(`https://www.mc-heads.net/avatar/${player.nickname}`) 
            .setFooter({ text: `/help [command] pour plus d'informations`, iconURL: 'https://media.discordapp.net/attachments/242779914330177536/1074676859788328992/fl_orange.png' });
  
          await client.channels.cache.get(`${config.discord.loggingChannel}`).send({ embeds: [statsEmbed] });   
        }
      }
    }

    if (this.isGuildListMessage(message)) {
      if(!message.includes('Online Members')) {
        if (message.includes('Guild Name') || message.includes('Total Members') || message.includes('Online Members')) {
          guildInfo.push(message)
        } else if (message.includes('--')) {
          guildRanks.push(message)
        } else {
          members.push(message)
        }
      } else {
        guildInfo.push(message)
        const guildInfoSplit = guildInfo[0].split(' ');
        const guildInfoSplit2 = guildInfo[1].split(' ');
        const guildInfoSplit3 = guildInfo[2].split(' ');
        for (let i = 0; i < members.length; i++) {
          members[i] = replaceAllRanks(members[i])
          members[i] = members[i].replaceAll('  ', ' ')
          members[i] = members[i].replaceAll(' ● ', '` ᛫ `')
          String.prototype.reverse = function () {return this.split('').reverse().join('')}
          String.prototype.replaceLast = function (what, replacement) {return this.reverse().replace(new RegExp(what.reverse()), replacement.reverse()).reverse()}
          members[i] = members[i].replaceLast(' ●', '`')
          members[i] = members[i].replaceLast('᛫ `', '')
        }
        let description = `Nombre de membres: **${guildInfoSplit2[2]}/125**\nMembres en ligne: **${guildInfoSplit3[2]}**\n`
        for (let i = 0; i < guildRanks.length; i++) {
          description+= `\n`
          guildRanks[i] = guildRanks[i].replaceAll('--', '**')
          description+= `${guildRanks[i]}\n \`${members[i]}`
        }

        this.minecraft.broadcastHeadedEmbed({
          message: `${description}`,
          title: guildInfoSplit[2],
          icon: `https://hypixel.paniek.de/guild/${config.minecraft.guildID}/banner.png`,
          color: 2067276,
          channel: 'Guild'
        })
        guildInfo = [];
        guildRanks = [];
        members = [];
      }
  }
  

    if (this.isLoginMessage(message)) {
      const data = JSON.parse(fs.readFileSync('config.json'));
      if (data.discord.joinMessage) { 
        const user = message.split('>')[1].trim().split('joined.')[0].trim()
        return this.minecraft.broadcastPlayerToggle({ 
          fullMessage: colouredMessage,
          username: user, 
          message: messages.loginMessage, 
          color: 2067276, 
          channel: 'Guild' 
        })
      }
    }

    if (this.isLogoutMessage(message)) {
      const data = JSON.parse(fs.readFileSync('config.json'));
      if (data.discord.joinMessage) { 
        const user = message.split('>')[1].trim().split('left.')[0].trim()
        return this.minecraft.broadcastPlayerToggle({ 
          fullMessage: colouredMessage,
          username: user, 
          message: messages.logoutMessage, 
          color: 15548997, 
          channel: 'Guild' 
        })
      }
    }

    if (this.isJoinMessage(message)) {
      const user = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[0]
      await delay(1000)
      bot.chat(`/gc ${messages.guildJoinMessage}`)
      return this.minecraft.broadcastHeadedEmbed({
        message: `${user} ${messages.joinMessage}`,
        title: `Membre rejoint`,
        icon: `https://mc-heads.net/avatar/${user}`,
        color: 2067276,
        channel: 'Logger'
      })
    }

    if (this.isLeaveMessage(message)) {
      const user = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[0]

      return this.minecraft.broadcastHeadedEmbed({
        message: `${user} ${messages.leaveMessage}`,
        title: `Membre à quitter`,
        icon: `https://mc-heads.net/avatar/${user}`,
        color: 15548997,
        channel: 'Logger'
      })
    }

    if (this.isKickMessage(message)) {
      const user = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[0]

      return this.minecraft.broadcastHeadedEmbed({
        message: `${user} ${messages.kickMessage}`,
        title: `Membre expulsé`,
        icon: `https://mc-heads.net/avatar/${user}`,
        color: 15548997,
        channel: 'Logger'
      })  
    }

    if (this.isPromotionMessage(message)) {
      const username = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[0]
      const newRank = message.replace(/\[(.*?)\]/g, '').trim().split(' to ').pop().trim()
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${username} ${messages.promotionMessage} ${newRank}`, 
        color: 2067276, 
        channel: 'Logger' 
      })
    }

    if (this.isDemotionMessage(message)) {
      const username = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[0]
      const newRank = message.replace(/\[(.*?)\]/g, '').trim().split(' to ').pop().trim()
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${username} ${messages.demotionMessage} ${newRank}`, 
        color: 15548997, 
        channel: 'Logger' 
      })
    }

    if (this.isCannotMuteMoreThanOneMonth(message)) {
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.cannotMuteMoreThanOneMonthMessage}`, 
        color: 15548997, 
        channel: 'Logger' 
      })
    }

    if (this.isBlockedMessage(message)) {
      const blockedMsg = message.match(/".+"/g)[0].slice(1, -1)
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.blockedMessageFirst} ${blockedMsg} ${messages.blockedMessageSecond}`, 
        color: 15548997, 
        channel: 'Logger' 
      })
    }

    if (this.isRepeatMessage(message)) {
      return client.channels.cache.get(bridgeChat).send({
        embeds: [{
          color: 15548997,
          description: `${messages.repeatMessage}`,
        }]
      })
    }

    if (this.isNoPermission(message)) {
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.noPermissionMessage}`, 
        color: 15548997, 
        channel: 'Logger' 
      })
    }

    if (this.isIncorrectUsage(message)) {
      return this.minecraft.broadcastCleanEmbed({ 
        message: message.split("'").join("`"), 
        color: 15548997, 
        channel: 'Logger' 
      })
    }
    
    if(this.isAlreadyBlacklistedMessage(message)) {
      return this.minecraft.broadcastHeadedEmbed({
        message: `${messages.alreadyBlacklistedMessage}`,
        title: `Blacklist`,
        color: 2067276,
        channel: 'Logger'
      })
    }

    if (this.isBlacklistMessage(message)) {
      const user = message.split(' ')[1]
      return this.minecraft.broadcastHeadedEmbed({
        message: `${user}${messages.blacklistMessage}`,
        title: `Blacklist`,
        color: 2067276,
        channel: 'Logger'
      })
    }

    if (this.isBlacklistRemovedMessage(message)) {
      const user = message.split(' ')[1]
      return this.minecraft.broadcastHeadedEmbed({
        message: `${user}${messages.blacklistRemoveMessage}`,
        title: `Blacklist`,
        color: 2067276,
        channel: 'Logger'
      })
    }

    if (this.isOnlineInvite(message)) {
      const user = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[2]
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${user} ${messages.onlineInvite}`, 
        color: 2067276, 
        channel: 'Logger' 
      })
    }

    if (this.isOfflineInvite(message)) {
      const user = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[6].match(/\w+/g)[0]
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${user} ${messages.offlineInvite}`, 
        color: 2067276, 
        channel: 'Logger' 
      })
    }

    if (this.isFailedInvite(message)) {
      return this.minecraft.broadcastCleanEmbed({ 
        message: message.replace(/\[(.*?)\]/g, '').trim(), 
        color: 15548997, 
        channel: 'Logger' 
      })
    }

    if (this.isGuildMuteMessage(message)) {
      const time = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[7]
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.guildMuteMessage} ${time}`,
        color: 15548997, 
        channel: 'Logger' 
      })
    }

    if (this.isGuildUnmuteMessage(message)) {
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.guildUnmuteMessage}`,
        color: 2067276, 
        channel: 'Logger' 
      })
    }

    if (this.isUserMuteMessage(message)) {
      const user = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[3].replace(/[^\w]+/g, '')
      const time = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[5]
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${user} ${messages.userMuteMessage} ${time}`, 
        color: 15548997, 
        channel: 'Logger' 
      })
    }

    if (this.isUserUnmuteMessage(message)) {
      const user = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[3]
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${user} ${messages.userUnmuteMessage}`, 
        color: 2067276, 
        channel: 'Logger' 
      })
    }

    if (this.isSetrankFail(message)) {
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.setrankFailMessage}`, 
        color: 15548997, 
        channel: 'Guild' 
      })
    }

    if (this.isGuildQuestCompletion(message)) { 
      this.minecraft.broadcastHeadedEmbed({ 
        title: 'Guild Quest Completion', 
        icon: `https://hypixel.paniek.de/guild/${config.minecraft.guildID}/banner.png`, 
        message: `${message}`,
        color: 15844367, 
        channel: 'Guild'
      })
    }

    if (this.isAlreadyMuted(message)) {
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.alreadyMutedMessage}`, 
        color: 15548997, 
        channel: 'Logger' 
      })
    }

    if (this.isNotInGuild(message)) {
      const user = message.replace(/\[(.*?)\]/g, '').trim().split(' ')[0]
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${user} ${messages.notInGuildMessage}`, 
        color: 15548997, 
        channel: 'Logger' 
      })
    }

    if (this.isLowestRank(message)) {
      const user = message.replace(/\[(.*?)\]/g, '').trim().split(' ')[0]
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${user} ${messages.lowestRankMessage}`, 
        color: 15548997, 
        channel: 'Logger' 
      })
    }

    if (this.isAlreadyHasRank(message)) {
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.alreadyHasRankMessage}`, 
        color: 15548997, 
        channel: 'Logger' })
    }

    if (this.isTooFast(message)) {
      return Logger.warnMessage(message)
    }

    if (this.isPlayerNotFound(message)) {
      const user = message.split(' ')[8].slice(1, -1)
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.playerNotFoundMessageFirst} ${user} ${messages.playerNotFoundMessageSecond}`, 
        color: 15548997,
        channel: 'Logger'
      })
    }

    if (config.console.debug) {
      this.minecraft.broadcastMessage({
        fullMessage: colouredMessage,
        message: 'debug_temp_message_ignore',
        chat: 'debugChannel'
      }
    )}

    const parts = message.split(':')
    const group = parts.shift().trim()
    const hasRank = group.endsWith(']')
    const chat = message.split('>')
    const chatType = chat.shift().trim()
    const userParts = group.split(' ')
    const username = userParts[userParts.length - (hasRank ? 2 : 1)]
    let guildRank = userParts[userParts.length - 1].replace('[', '').replace(']', '')
    const playerMessage = parts.join(':').trim()

    if (!this.isGuildMessage(message) && !this.isOfficerChatMessage(message)) return
    if (guildRank == username) guildRank = 'Member'
    if (this.isMessageFromBot(username)) return
    if (playerMessage.length == 0 || this.command.handle(username, playerMessage)) return
    if (playerMessage == '@') return

    this.minecraft.broadcastMessage({
      fullMessage: colouredMessage,
      username: username,
      message: playerMessage,
      guildRank: guildRank,
      chat: chatType,
    })
    
  }
  
  isGuildLoginMessage(message) {
    return message.startsWith('Guild >') && message.endsWith('joined.') && !message.includes(':')
  }

  isMessageFromBot(username) {
    return bot.username === username
  }

  isAlreadyBlacklistedMessage(message) {
    return message.includes(`You've already ignored that player! /ignore remove Player to unignore them!`) && !message.includes(':')
  }
  isBlacklistRemovedMessage(message) {
    return message.startsWith('Removed') && message.includes('from your ignore list.') && !message.includes(':')
  }

  isBlacklistMessage(message) {
    return message.startsWith('Added') && message.includes('to your ignore list.') && !message.includes(':')
  }

  isGuildMessage(message) {
    return message.startsWith('Guild >') && message.includes(':')
  }

  isOfficerChatMessage(message) {
    return message.startsWith('Officer >') && message.includes(':')
  }

  isGuildQuestCompletion(message) {
    return message.includes('GUILD QUEST TIER ') && message.includes('COMPLETED') && !message.includes(':')
  }

  isLoginMessage(message) {
    return message.startsWith('Guild >') && message.endsWith('joined.') && !message.includes(':')
  }

  isLogoutMessage(message) {
    return message.startsWith('Guild >') && message.endsWith('left.') && !message.includes(':')
  }

  isJoinMessage(message) {
    return message.includes('joined the guild!') && !message.includes(':')
  }

  isLeaveMessage(message) {
    return message.includes('left the guild!') && !message.includes(':')
  }

  isKickMessage(message) {
    return message.includes('was kicked from the guild by') && !message.includes(':')
  }

  isGuildTopMessage(message) {
    return message.includes('Guild Experience') && !message.includes('●') && !message.includes(':')
  }

  isSwitchServerMessage(message) {
    return message.includes('Sending to server')
  }

  isKickServerMessage(message) {
    return message.includes('Evacuating to Hub...')
  }

  isGameUpdateMessage(message) {
    return message.includes('This server will restart soon: Game Update')
  }

  isRestartServerMessage(message) {
    return message.includes('[Important] This server will restart soon: Scheduled Restart')
  }

  isBugServerMessage(message) {
    return message.includes('An exception occurred in your connection, so you were put in the SkyBlock Lobby!') || message.includes('Out of sync, check your internet connection!')
  }

  isGuildListMessage(message) {
    return message.includes('●') || message.includes(' -- ') && message.includes(' -- ') || message.startsWith('Online Members: ') || message.includes('Online Members: ') || message.startsWith('Total Members:') ||  message.startsWith('Guild Name:')
  }

  isPromotionMessage(message) {
    return message.includes('was promoted from') && !message.includes(':')
  }

  isDemotionMessage(message) {
    return message.includes('was demoted from') && !message.includes(':')
  }
  
  isRequestMessage(message) {
    return message.includes('has requested to join the Guild!')
  }

  isBlockedMessage(message) {
    return message.includes('We blocked your comment') && !message.includes(':')
  }

  isRepeatMessage(message) {
    return message == 'You cannot say the same message twice!'
  }

  isNoPermission(message) {
    return (message.includes('You must be the Guild Master to use that command!') || message.includes('You do not have permission to use this command!') || message.includes("I'm sorry, but you do not have permission to perform this command. Please contact the server administrators if you believe that this is in error.") || message.includes("You cannot mute a guild member with a higher guild rank!") || message.includes("You cannot kick this player!") || message.includes("You can only promote up to your own rank!") || message.includes("You cannot mute yourself from the guild!") || message.includes("is the guild master so can't be demoted!") || message.includes("is the guild master so can't be promoted anymore!")) && !message.includes(":")
  }

  isIncorrectUsage(message) {
    return message.includes('Invalid usage!') && !message.includes(':')
  }

  isOnlineInvite(message) {
    return message.includes('You invited') && message.includes('to your guild. They have 5 minutes to accept.') && !message.includes(':')
  }

  isOfflineInvite(message) {
    return message.includes('You sent an offline invite to') && message.includes('They will have 5 minutes to accept once they come online!') && !message.includes(':')
  }

  isFailedInvite(message) {
    return (message.includes('is already in another guild!') || message.includes('You cannot invite this player to your guild!') || (message.includes("You've already invited") && message.includes("to your guild! Wait for them to accept!")) || message.includes('is already in your guild!')) && !message.includes(':')
  }

  isUserMuteMessage(message) {
    return message.includes('has muted') && message.includes('for') && !message.includes(':')
  }

  isUserUnmuteMessage(message) {
    return message.includes('has unmuted') && !message.includes(':')
  }

  isCannotMuteMoreThanOneMonth(message) {
    return message.includes('You cannot mute someone for more than one month') && !message.includes(':')
  }

  isGuildMuteMessage(message) {
    return message.includes('has muted the guild chat for') && !message.includes(':')
  }

  isGuildUnmuteMessage(message) {
    return message.includes('has unmuted the guild chat!') && !message.includes(':')
  }

  isSetrankFail(message) {
    return message.includes("I couldn't find a rank by the name of ") && !message.includes(':')
  }

  isAlreadyMuted(message) {
    return message.includes('This player is already muted!') && !message.includes(':')
  }

  isNotInGuild(message) {
    return message.includes(' is not in your guild!') && !message.includes(':')
  }

  isLowestRank(message) {
    return message.includes("is already the lowest rank you've created!") && !message.includes(':')
  }

  isAlreadyHasRank(message) {
    return message.includes('They already have that rank!') && !message.includes(':')
  }

  isLimboJoinMessage(message) {
    return message.endsWith(' a queue.')
  }

  isSkyBlockJoinMessage(message) {
    return (message.endsWith(' the lobby!') || message.endsWith(' the lobby! <<<')) && message.includes('[MVP+')
  }

  isTooFast(message) {
    return message.includes('You are sending commands too fast! Please slow down.') && !message.includes(':')
  }

  isPlayerNotFound(message) {
    return message.startsWith(`Can't find a player by the name of`)
  }

}

module.exports = StateHandler