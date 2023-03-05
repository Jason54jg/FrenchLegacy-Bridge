const {
  Client,
  Collection,
  AttachmentBuilder,
  GatewayIntentBits,
  Partials,
  ActivityType,
  EmbedBuilder,
  Discord
} = require("discord.js");
const CommunicationBridge = require("../contracts/CommunicationBridge.js");
const messageToImage = require("../contracts/messageToImage.js");
const MessageHandler = require("./handlers/MessageHandler.js");
const StateHandler = require("./handlers/StateHandler.js");
const CommandHandler = require("./CommandHandler.js");
const config = require("../../config.json");
const Logger = require(".././Logger.js");
const path = require("node:path");
const fs = require("fs");
const { kill } = require("node:process");
let channel;
const guild_online = require("./fonction_pour_bot/guild_online")

class DiscordManager extends CommunicationBridge {
  constructor(app) {
    super();

    this.app = app;

    this.stateHandler = new StateHandler(this);
    this.messageHandler = new MessageHandler(this);
    this.commandHandler = new CommandHandler(this);
  }
  async delay(ms) {
    return await new Promise(resolve => setTimeout(resolve,ms));
  }
  async envoyer(channelee) {
    for (let i = 0; i < 1; i) {
      let embed = await guild_online.guild_online("FrenchLegacy");
      channelee.send({ embeds: [embed] });
      await this.delay(600000);
      let embed2 = await guild_online.guild_online("FrenchLegacyII");
      channelee.send({ embeds: [embed2] });
      await this.delay(900000)
  };}

  async connect() {
    global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildWebhooks
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember,
    ]
});

    this.client = client;

    this.client.on("ready", () => {
        const err_fragbotChannelId = config.discord.channels.fragbotChannelId
        const err_logchan = client.channels.cache.get(err_fragbotChannelId);

        const activities = [
            { name: `Hypixel`, type: ActivityType.Playing },
            { name: `Les Recrutement`, type: ActivityType.Watching },
            { name: `Vos ticket`, type: ActivityType.Watching }
        ];

        let i = 0;
        setInterval(() => {
            if(i >= activities.length) i = 0
		    client.user.setActivity(activities[i]);
		    i++;
        }, 5000);

        const information = new EmbedBuilder()
        .addFields(
            { name: "Comment obtenir le pseudo d'un bot ?", value: "Pour trouver le pseudo d'un bot, il suffit de regarder dans ce channel."},
            { name: "Comment invité le fragbot ?", value: "Étape 1 : Crée une partie avec le bot, vous pouvez le faire en utilisant /p <nom du bot>.\nÉtape 2 : Entrez dans un donjon pendant que le bot est dans votre groupe.\nÉtape 3 : Profiter\nÉtape 4 : Répéter"},
        )
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        const FrenchBot = new EmbedBuilder()
        .setTitle('FrenchBot Logs')
        .addFields({ name: 'Connecté : ✅', value: '\u200B'})
        .setFooter({text: "FrenchLegacy", iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png"});

        err_logchan.send({embeds: [information, FrenchBot] });

      this.stateHandler.onReady();
      const channel_envoie = this.app.discord.client.channels.cache.get(config.discord.channels.guildOnlineChannel)
      this.envoyer(channel_envoie)
    });

    this.client.on("messageCreate", (message) =>
      this.messageHandler.onMessage(message)
    );

    this.client.login(config.discord.bot.token).catch((error) => {
      Logger.errorMessage(error);
    });

    // Lorsque la session du bot devient invalide, tente de se reconnecter toutes les 30 secondes
    this.client.on("invalidated", () => {
      const retrier = setInterval(function() {retryConnect(retrier, this)}, 30*1000)
      this.client.destroy();
    })

    client.commands = new Collection();
    const commandFiles = fs
      .readdirSync("src/discord/commands")
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      client.commands.set(command.name, command);
    }

    const eventsPath = path.join(__dirname, "events");
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);
      event.once
        ? client.once(event.name, (...args) => event.execute(...args))
        : client.on(event.name, (...args) => event.execute(...args));
    }

    global.guild = await client.guilds.fetch(config.discord.bot.serverID);

    process.on("SIGINT", () => {
      this.stateHandler.onClose().then(() => {
        client.destroy();
        kill(process.pid);
      });
    });
    return true;
  }

  async getChannel(type) {
    switch (type) {
      case "Officer":
        return this.app.discord.client.channels.cache.get(
          config.discord.channels.officerChannel
        );
      case "Logger":
        return this.app.discord.client.channels.cache.get(
          config.discord.channels.loggingChannel
        );
      case "debugChannel":
        return this.app.discord.client.channels.cache.get(
          config.discord.channels.debugChannel
        );
      case "guildonline":
        return(this.app.discord.client.channels.cache.get(
          config.discord.channels.guildOnlineChannel
        ))
      default:
        return this.app.discord.client.channels.cache.get(
          config.discord.channels.guildChatChannel
        );
    }
  }

  async getWebhook(discord, type) {
    channel = await this.getChannel(type);
    const webhooks = await channel.fetchWebhooks();

    if (webhooks.size === 0) {
      channel.createWebhook({
        name: "Hypixel Chat Bridge",
        avatar: "https://i.imgur.com/AfFp7pu.png",
      });

      await this.getWebhook(discord, type);
    }

    return webhooks.first();
  }

  async onBroadcast({
    fullMessage,
    username,
    message,
    guildRank,
    chat,
    color = 1752220,
  }) {
    let mode = config.discord.other.messageMode.toLowerCase();
    if (message === undefined) {
      if (config.discord.channels.debugMode === false) {
        return;
      }

      mode = "minecraft";
    }

    if (username !== undefined) {
      Logger.broadcastMessage(`${username} [${guildRank}]: ${message}`, `Discord`);
    }

    channel = await this.getChannel(chat || "Guild");
    if (channel === undefined) return;

    switch (mode) {
      case "bot":
        channel.send({
          embeds: [
            {
              description: message,
              color: this.hexToDec(color),
              timestamp: new Date(),
              footer: {
                text: guildRank,
              },
              author: {
                name: username,
                icon_url: `https://www.mc-heads.net/avatar/${username}`,
              },
            },
          ],
        });
        break;

      case "webhook":
        message = message.replace(/@/g, "");
        this.app.discord.webhook = await this.getWebhook(
          this.app.discord,
          chat
        );
        this.app.discord.webhook.send({
          content: message,
          username: `${username} [${guildRank}]`,
          avatarURL: `https://www.mc-heads.net/avatar/${username}`,
        });
        break;

      case "minecraft":
        await channel.send({
          files: [
            new AttachmentBuilder(messageToImage(fullMessage), {
              name: `${username}.png`,
            }),
          ],
        });

        if (fullMessage.includes("https://")) {
          const link = fullMessage.match(/https?:\/\/[^\s]+/g)[0];
          channel = await this.getChannel(chat);
          await channel.send(link);
        }

        break;
        
      default:
        throw new Error(
          "Invalid message mode: must be bot, webhook or minecraft"
        );
    }
  }

  async onBroadcastCleanEmbed({ message, color, channel }) {
    Logger.broadcastMessage(message, "Event");
    channel = await this.getChannel(channel);
    channel.send({
      embeds: [
        {
          color: color,
          description: message,
        },
      ],
    });
  }

  async onBroadcastHeadedEmbed({ message, title, icon, color, channel }) {
    Logger.broadcastMessage(message, "Event");
    channel = await this.getChannel(channel);
    channel.send({
      embeds: [
        {
          color: color,
          author: {
            name: title,
            icon_url: icon,
          },
          description: message,
        },
      ],
    });
  }

  async onPlayerToggle({ fullMessage, username, message, color, channel }) {
    Logger.broadcastMessage(username + " " + message, "Event");
    channel = await this.getChannel(channel);
    switch (config.discord.other.messageMode.toLowerCase()) {
      case "bot":
        channel.send({
          embeds: [
            {
              color: color,
              timestamp: new Date(),
              author: {
                name: `${username} ${message}`,
                icon_url: `https://www.mc-heads.net/avatar/${username}`,
              },
            },
          ],
        });
        break;
      case "webhook":
        this.app.discord.webhook = await this.getWebhook(
          this.app.discord,
          channel
        );
        this.app.discord.webhook.send({
          username: `${username} [${guildRank}]`,
          avatarURL: `https://www.mc-heads.net/avatar/${username}`,
          embeds: [
            {
              color: color,
              description: `${username} ${message}`,
            },
          ],
        });

        break;
      case "minecraft":
        await channel.send({
          files: [
            new AttachmentBuilder(messageToImage(fullMessage), {
              name: `${username}.png`,
            }),
          ],
        });
        break;
      default:
        throw new Error("Invalid message mode: must be bot or webhook");
    }
  }

  hexToDec(hex) {
    return parseInt(hex.replace("#", ""), 16);
  }
}


async function retryConnect(origin, manager) {
  if(await manager.connect() == true) {
    clearInterval(origin);
  }
}

module.exports = DiscordManager;
