# FrenchLegacy Bridge

Un BridgeChat entre le chat de la guilde [FrenchLegacy](https://hypixel.net/threads/french-legacy-fl-1-guilde-fran%C3%A7aise-skyblock-10-guilde-skyblock-leaderbord-200-membres-requirements-ouvert.5278673/) et un [Discord](https://discord.gg/Fpm9qvKbbV). L'application utilise [discord.js v13](https://github.com/discordjs/discord.js) pour communiquer avec Discord, et [Mineflayer](https://github.com/PrismarineJS/mineflayer) pour communiquer avec Hypixel .

> ⚠️ Cette application se connectera à Hypixel en utilisant Mineflayer qui n'est pas un client Minecraft normal, cela pourrait entraîner l'interdiction de votre compte Minecraft d'Hypixel, alors utilisez cette application à vos risques et périls. Je ne suis pas responsable des interdictions qui pourraient survenir. ⚠️

<hr>

## Information

- [Installation avec NodeJS](#NodeJS)
- [Commandes](#Commands)
- [Configuration](#configuration)
- [Liste de choses à faire](#to-do-list)

## NodeJS

- Git
- NodeJS >= 16.9
- Un compte Minecraft

### Guide d'installation pour NodeJS

Pour commencer, clonez le référentiel en utilisant:

    git clone https://github.com/Jason54jg/FrenchLegacy-Bridge.git

Allez ensuite dans le dossier `FrenchLegacy-Bridge` et installez toutes les dépendances à l'aide de NPM.

    npm install

C'est assez explicite, mais si vous avez besoin d'aide, vous pouvez consulter la section [Configuration](#configuration). Une fois que vous avez terminé l'édition, enregistrez-le et renommez-le en `config.json`.

Une fois éditées et les dépendances installées, vous pouvez lancer l'application en utilisant :

    node index.js

En utilisant le lien fourni dans la console, vous vous connectez au compte minecraft que vous souhaitez utiliser.

## Configuration

#### Minecraft

Le `prefix` est le préfixe de commande utilisé pour toutes les commandes du bot du côté Discord, par défaut, il est défini sur `!`.

`guildID` est l'ID de la guilde hypixel requise pour l'API Hypixel, `guildExp` est la valeur entière requise pour la commande `!gexp` qui est utilisée pour vérifier combien d'expérience de guilde supplémentaire l'utilisateur doit collecter pour répondre aux exigences de la guilde.

`messageRepeatBypass` est la possibilité de basculer le contournement pour que les utilisateurs utilisent la même commande dos à dos sans que le bot ne soit arrêté par le chat hypixel, je vous recommande de le garder.

`messageRepeatBypassLength` est la longueur du message qui sera envoyé pour contourner la répétition du message, je vous recommande de le garder sur au moins 16.
#### Discord

Les options Discord incluent les options `token`, `clientID`, `serverID`, `guildChatChannel`, `officerChannel`, `loggingChannel`, `commandRole`, `prefix`, `messageMode`, `joinMessage` et `filterMessages`.

Le `token` est le jeton de l'application Discord, si vous n'avez pas encore d'application Discord, vous pouvez [créer une nouvelle application](https://discordapp.com/developers), puis convertir l'application en bot Discord, puis récupérez votre jeton de bot Discord sur la page "Bot".

Le `clientID` est l'ID Discord du bot Discord. Vous devez d'abord activer le mode développeur qui peut être situé dans les paramètres sous la balise avancée, vous pouvez obtenir l'ID client en cliquant avec le bouton droit sur Discord bot et en cliquant sur Copier l'ID.

Le `serverID` est identique à `clientID` mais c'est l'ID du serveur. vous pouvez l'obtenir en faisant un clic droit sur le serveur et en cliquant sur Copier l'ID.

Le `guildChatChannel` est l'ID du canal de texte avec lequel le bot doit être lié, le bot n'enverra et n'écoutera que les messages dans le canal défini dans la configuration.

Le `officerChannel` est l'ID du canal de texte avec lequel le bot doit être lié pour le chat de l'officier, le bot n'enverra et n'écoutera que les messages dans le canal défini dans la configuration.

Le `loggingChannel` est l'ID du canal de texte avec lequel le bot doit être lié pour le Logging Chat, le bot n'enverra et n'écoutera que des trucs de gestion de guilde comme les coups de pied, les muets, les promotions, les rétrogradations, etc.

Le `commandRole` est l'ID de n'importe quel rôle sur le serveur pour lequel le bot est hébergé, tout utilisateur avec le rôle pourra exécuter toutes les commandes Discord intégrées au bot, comme `/kick` et `/promote`.

> Remarque : n'importe quel utilisateur peut exécuter les commandes `/online` et `/guildtop`, cependant toutes les autres commandes nécessitent que l'utilisateur ait le rôle de commande.

Le `messageMode` peut être soit `bot`, `webhook` ou `minecraft`. Cela sélectionne la façon dont les messages doivent être affichés lorsqu'ils sont envoyés de Minecraft à Discord. Si le mode webhook est sélectionné, le bot a besoin de l'autorisation "Gérer les webhooks" dans le canal dans lequel il s'exécute. Le bot a toujours besoin des autorisations "Envoyer des messages" et "Afficher le canal" dans le canal dans lequel vous l'utilisez.

- [Voir l'exemple de Webhook](https://imgur.com/DttmVtQ)
- [Voir l'exemple du mode bot](https://imgur.com/WvRAeZc)
- [Voir l'exemple du mode Minecraft](https://imgur.com/MAAMpiT)

> Remarque - La limite de taux Discord pour les webhooks est de 30 requêtes toutes les 60 secondes, alors que pour les messages de bot normaux, c'est 5 messages toutes les 5 secondes. L'utilisation de webhooks réduit de moitié le nombre de messages que le bot peut envoyer par minute, ce qui peut causer des problèmes dans une guilde active.

Le filterMessage permet de basculer le filtrage des messages. Cela devrait être défini sur "false", sinon le bot pourrait être banni.

Le joinMessage est la capacité de basculer entre rejoindre et laisser un message envoyé au canal discord. Cela devrait être défini sur "false" dans une guilde inactive car les messages peuvent être du spam.

### Console

Les options Discord incluent les options `maxEventSize`, `debug` et `debugChannel`.

Le `maxEventSize` est la longueur maximale du message qui peut être enregistré. Je vous recommande de ne pas y toucher à moins que vous ne sachiez ce que vous faites.

Le `debug` est une option pour basculer la journalisation de tous les messages sur discord, même le chat public. Ceci est utile pour vérifier quelque chose mais vous ne pouvez pas accéder au PC ou vous êtes paresseux pour lancer minecraft.

Le `debugChannel` est l'ID du canal de texte où le bot doit envoyer des messages.

### API

Les options de l'API incluent des informations sur les API utilisées, les seules qui doivent être modifiées sont `hypixelAPIkey`, `antiSniperKey`, `pixelicAPIkey` et `imgurAPIkey`.

Vous pouvez recevoir la clé API Hypixel en rejoignant le réseau Hypixel et en tapant la commande `/api new`.

> L'API Hypixel est utilisée pour la plupart des commandes.

La clé AntiSniper peut être générée [Ici](https://api.antisniper.net/).

> L'API AntiSniper est utilisée pour les commandes `!denick`.

L'API Imgur peut être générée [ici](https://api.imgur.com/oauth2/addclient).

> L'API Imgur est utilisée pour le rendu de commandes telles que `!armor`, `!pet`, `!equipment` etc.

L'API Pixelic peut être générée [ici](https://api.pixelic.de).

> L'API Pixelic est utilisée pour les commandes `!daily`, `!weekly` et `!monthly`.

### Event

Les options d'événement incluent divers événements qui seront notifiés par le robot 30 et 5 minutes avant le début de l'événement. Si vous n'aimez pas l'un des événements, changez simplement la valeur de "true" à "false". Il est également possible de désactiver complètement la notification de bot dans l'option "activé".

### Guild Requirements

Le bot inclut également l'acceptation automatique de la guilde si l'utilisateur répond aux exigences. Les exigences sont définies dans le config.json, si la valeur de l'exigence est de 0 ou inférieure à 0, elle ne sera pas prise en compte.

`enabled` est une option, doit-elle vérifier les exigences de la personne qui essaie de rejoindre Guild ou non. Si cette option est activée, la demande sera envoyée au canal de journalisation sur le discord.

`autoAccept` est une option pour activer ou non l'acceptation automatique de la guilde, si l'utilisateur répond aux exigences, il sera automatiquement accepté par le bot.

L'option `requirements` a des sous-options, qui sont des exigences.

### Commands

`< >` = Arguments obligatoires, `[ ]` = Arguments facultatifs

`Discord`

| Command      | Description                                      | Syntax                      | Example                             | Response                           |
|--------------| ------------------------------------------------ |-----------------------------|-------------------------------------| ---------------------------------- |
| blacklist    | Bloque l'utilisateur spécifié contre l'utilisation du bot. | `/blacklist [arg] [joueur]` | `/blacklist ajouter DuckySoSkilled` | ![](https://imgur.com/Ybaj9wj.png) |
| demote       | Rétrograde l'utilisateur donné d'un rang de guilde. | `/demote [joueur]`          | `/demote DuckySoSkilled`            | ![](https://imgur.com/liHDaOW.png) |
| guildtop     | Top 10 des membres avec le plus d'xp de guilde. | `/guildtop [Nombre]`        | `/guildtop 5`                       | ![](https://imgur.com/7oV77ey.png) |
| help         | Affiche le menu d'aide. | `/help`                     | `/help`                             | ![](https://imgur.com/CLka3pQ.png) |
| infos        | Affiche des informations sur le bot. | `/info`                     | `/info`                             | ![](https://imgur.com/pRONsiE.png) |
| invite       | Invite l'utilisateur spécifié dans la guilde. | `/invite [joueur]`          | `/invite DuckySoSkilled`            | ![](https://imgur.com/DIfzSS7.png) |
| kick         | Expulse l'utilisateur spécifié de la guilde. | `/kick [joueur] [raison]`   | `/kick DuckySoSkilled`              | ![](https://imgur.com/auMbSD9.png) |
| mute         | Coupe le son de l'utilisateur donné pendant une durée donnée. | `/mute [joueur] [heure]`    | `/mute DuckySoSkilled 1h`           | ![](https://imgur.com/fQxoyHv.png) |
| online       | Voir le joueur en ligne dans la guilde.                 | `/online`                   | `/online`                           | ![](https://imgur.com/Ny4vTRQ.png) |
| execute      | Exécute les commandes en tant que bot minecraft. | `/execute [commande]`       | `/execute /g unmute DuckySoSkilled` | ![](https://imgur.com/fBi2Bv2.png) |
| ping         | Affiche la latence du bot. | `/ping`                     | `/ping`                             | ![](https://imgur.com/9sHFgGT.png) |
| promote      | Promeut l'utilisateur spécifié d'un rang. | `/promote [joueur]`         | `/promote DuckySoSkilled`           | ![](https://imgur.com/wmMWP5b.png) |
| unmute     | Rétablit le son de l'utilisateur donné. | `/unmute [joueur]`          | `/unmute DuckySoSkilled`            | ![](https://imgur.com/nlu8lo6.png) |
| uptime | Affiche la disponibilité du bot.                     | `/uptime`                   | `/uptime`                           | ![](https://imgur.com/R1cnJfn.png) |

`Minecraft`

| Command        | Description                                 | Syntax                           | Example                          | Response                                                                                                                                                                                                                                     |
|----------------| ------------------------------------------- |----------------------------------|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| accessories    | Accessoires de l'utilisateur spécifié. | `!accessories [joueur]`          | `!accessories Refraction`        | `Accessoires de Refraction » 98 Recombobulés » 97 Enrichis » 43` & `Accessoires de Refraction » Communs - 0 Inhabituels - 16 Rares - 13 Épiques - 26 Légendaires - 16 Spéciaux - 0 Très Spéciaux - 2`                                        |
| armor          | Rend l'armure de l'utilisateur spécifié. | `!armor [joueur]`                | `!armor DeathStreeks`            | `L'armure de DeathStreeks » https://i.imgur.com/JdijFmo.png https://i.imgur.com/8uBpRrY.png https://i.imgur.com/oVQl6WV.png https://i.imgur .com/x7wlfnk.png`                                                                                |
| auction        | Enchères actives de l'utilisateur spécifié. | `!auction [joueur]`              | `!auction DuckySoSkilled`        | `Les enchères actives de DuckySoSkilled » https://i.imgur.com/9Jw8zCK.png`                                                                                                                                                                   |
| catacombes     | Skyblock Dungeons Statistiques de l'utilisateur spécifié. | `!catacombes [joueur]`           | `!catacombes DeathStreeks`       | `Catacombes de DeathStreeks: 62,29 Moyenne de classe: 50 Secrets trouvés: 279 088 (8,50 SPR) Classes: H - 50 M - 50 B - 50 A - 50 T - 50`                                                                                                    |
| daily          | Obtenez les statistiques quotidiennes de l'utilisateur spécifié.          | `!daily [player] [gamemode]`     | `!daily DuckySoSkilled`          | `DuckySoSkilled has gained 0 karma and gained 0.1 levels in the last day.`                                                                                                                                                                   |
| denick         | Denick nom d'utilisateur de l'utilisateur spécifié. | `!denick [joueur]`               | `!denick the_good_anime`         | `[MVP++] rajas0423 est surnommé the_good_anime`                                                                                                                                                                                              |
| equipment      | Rend l'équipement de l'utilisateur spécifié. | `!equipment [joueur]`            | `!equipment Refraction`          | `Équipement de réfraction » https://i.imgur.com/QOU2r0O.png https://i.imgur.com/dUrotYa.png https://i.imgur.com/0Fxnkjd.png https://i.imgur .com/wIEcrZX.png`                                                                                |
| fairysouls | Fairy Souls de l'utilisateur spécifié. | `!fairysouls [joueur]`           | `!fairysouls DeathStreeks`       | `Les âmes féeriques de DeathStreeks : 238/238 Progrès: 100,00%`                                                                                                                                                                              |
| fetchur       | Informations sur un article pour Fetchur. | `!fetchur [élément]`             | `!fetchur`                       | `Fetchur Requests » 1x Superboom TNT Description: Cet objet peut être acheté à l'hôtel des ventes ou trouvé dans les donjons`                                                                                                                |
| guildexp     | Expérience de guildes de l'utilisateur spécifié.        | `!guildexp [player]`             | `!guildexp DuckySoSkilled`       | `Your Weekly Guild Experience » 1,495`                                                                                                                                                                                                       |
| help           | Affiche le menu d'aide. | `!help`                          | `!help`                          | `https://imgur.com/BQBQXwN.png`                                                                                                                                                                                                              |
| level          | Niveau Skyblock de l'utilisateur spécifié. | `level [joueur]`                 | `!level DeathStreeks`            | `Niveau Skyblock de DeathStreek » 354.59`                                                                                                                                                                                                    |
| math           | Calculez tout type de problème mathématique. | `!math <calcul>`                 | `!math 6 * 9 + 6 + 9`            | `6*9+6+9 = 69`                                                                                                                                                                                                                               |
| monthly        | Obtenez les statistiques mensuelles de l'utilisateur spécifié. | `!monthly [joueur]`              | `!monthly DuckySoSkilled` | `DuckySoSkilled a gagné 0 karma et gagné 0,1 niveaux au cours du dernier mois.`                                                                                                                                                              |
| networth       | Networth de l'utilisateur spécifié.| `!networth [joueur]`             | `!networth Réfraction `          | `Refraction's Networth est 114 B Unsoulbound Networth : 61,9 B Purse : 3,56 B Bank : 1,07 B`                                                                                                                                                 |
| pet            | Rend l'animal de compagnie actif de l'utilisateur spécifié. | `!pet [joueur]`  | `!pet Réfraction`                | `Animal actif de la réfraction » https://i.imgur.com/FVuLQk4.png`                                                                                                                                                                            |
| render         | Rend l'élément de l'utilisateur spécifié. | `!render [joueur] [emplacement]` | `!render DuckySoSkilled`         | `Article de DuckySoSkilled à l'emplacement 1 » https://i.imgur.com/U2dIcSc.png`                                                                                                                                                              |
| skills         | Compétences et moyenne des compétences de l'utilisateur spécifié. | `!skills [joueur]`          | `!skills DuckySoSkilled`         | `Moyenne de compétence » 54.44 Agriculture - 60.00 Exploitation minière - 60.00 Combat - 60.00 Enchantement - 60.00 Pêche - 50.00 Cueillette - 50.00 Alchimie - 50.00 Apprivoisement - 50.00 Menuiserie - 50.00`                             |
| skyblock       | Statistiques Skyblock de l'utilisateur spécifié.| `!skyblock [joueur]`             | `!skyblock DeathStreeks`         | `DeathStreeks's Level » 354.59 Senither Weight » 44,455 Lily Weight » 39,268 Skill Average » 54.4 Slayer » 7,918,100 Catacombs » 62 Class Average » 50 Networth » 133 B Accessories » 98 Recombobulated » 97 Enriched » 44`                  |
| tueur          | Slayer de l'utilisateur spécifié. | `!slayer [joueur] [type]`         | `!slayer DeathStreeks`           | `DeathStreeks's Slayer - Zombie : Niveau : 9 Expérience : 3 165 000 Araignée : Niveau : 9 Expérience : 1 000 625 Loup : Niveau : 9 Expérience : 1 002 000 Enderman : Niveau : 9 Expérience : 1 715 475 Blaze : Niveau : 9 Expérience : 1 035 000` |
| weekly         | Obtenez les statistiques hebdomadaires de l'utilisateur spécifié. | `!weekly [joueur]`         | `!weekly DuckySoSkilled`         | `DuckySoSkilled a gagné 0 karma et gagné 0,1 niveau la semaine dernière.`                                                                                                                                                                    |
| weight         | Statistiques Skyblock de l'utilisateur spécifié.           | `!weight [joueur]`               | `!weight DuckySoSkilled`         | `Poids Senither de Refraction » 27721.82 Compétences : 12991.95 Donjons : 11353.90` & `Poids Lily de Refraction » 28342.24 Compétences » 12310.84 slayer » 4476.85 Donjons » 11554.55`                                                       |

### Chat Triggers Module

Si vous pensez que ce format de message est ennuyeux, vous pouvez consulter mon référentiel pour le module ChatTriggers qui modifie l'apparence des messages de Bot. [Cliquez ici] (https://github.com/DuckySoLucky/Hypixel-Guild-Chat-Format)

#### Frag Bot

Le bot comprend également un bot frag intégré qui peut être utilisé par la guilde.

### To-Do List

- [ ] Bug
    - Lors de l'envoi de message dans le salon discord par un utilisateur qu'un seul bot r'envoi le message dans le tchat
    - Commande utiliser sur discord doit fonctionner pour chaque bot (exemple pour l'invite d'un joueur) faire une sélection de quelle guilde on veut l'invité
- [ ] Envoi de Message entre deux guildes
    - Faire en sorte que le bot de la première guilde envoi dans la deuxième guilde ainsi que la deuxième guilde.
- [ ] Channel avec le nombre de membres
    - Un Channel qui permet de voir le nombre de membres dans la guilde et qui s'actualise automatiquement
- [ ] Channel avec le nombre de connectés
    - Un Channel qui permet de voir le nombre de connectés et qui s'actualise automatiquement
- [ ] Roster de la guilde
    - Un embed qui est envoyé dans un salon et qui s'actualise avec tous les membres de la guilde
- [ ] Système de ticket
    - Création de plusieur categorise de ticket avec plusieur bouton et quand on crée un ticket il y est affiché deux boutons sous une embed (Fermer et Claim) lors de la selection claim le bot affichera seulement le salon pour la personne qui a claim et le créateur du ticket et lors de la fermeture du ticket ça envoi des logs dans un salon
- [ ] Système de points avec les tickets
    - Lors du claim du ticket la personne reçoit un certain nombre de points tout depends de la difficulté du ticket (ne doit pas pouvoir glitch le système)
- [ ] Système de perte de points
    - Faire une commande pour voir l'historique des warns apres 5 warns blacklist des ticket.
- [ ] Commandes de warns
    - Commande qui permet de mettre un avertissement qui lui ajoute un rôle avec une perte de points.
- [ ] Leaderboard de points
    - Permet de voir qui a le plus de points et aussi de voir qui a le moins de points.
- [ ] Système de giveaway
    - Permet de créer, annuler, reroll ou de stop des giveaway avec une commande.
- [ ] Auto channel vocal
    - Fonction qui permet de créer des salons quand quelqu'un rejoint un salon définit et de pouvoir gérer son propre salon avec des commandes.
- [ ] Message de bienvenue et au revoir
    - Envoi d'une embed avec quelque info par qui il a été invité et combien il y a de membres sur le discord en lui indiquant d'aller dans le salon links.
- [ ] Auto réaction pour un salon
    - Le bot mettra une réaction à chaque fois qu'un message est envoyé dans un salon.
- [ ] Système de level avec des rôles
    - Permet d'attribuer des rôles avec un certain nombre d'xp possible d'en avec l'activité écrit et vocal commande pour le leaderboard.
- [ ] Sauvegarde de rôles
    - Permet d'enregistrer tous les rôles d'une personne quand il quitte le discord et qu'il revient.
- [ ] Système de mute
    - Permet de mute une personne avec un temps lui attribut un rôle mute.
- [ ] Logs
    - Des logs exemple changement de nom, mise à jour des rôles, suppression du salon ....
- [ ] Fil d'actualité auto
    - Création d'un fil d'actualité quand une personne envoi un message dans un salon.
- [ ] Auto rôle
    - Ajout automatique de certain rôle.
- [ ] Sélection rôle
    - Embed avec une selon de rôles.
- [ ] Notifications Twitch
    - Envoi un message dans un salon quand une personne de la liste est en live.
      

## Crédits

- [Altpapier](https://github.com/altpapier/hypixel-discord-guild-bridge/)
- [DawJaw](https://dawjaw.net/jacobs)
- [Hypixel API Reborn](https://hypixel.stavzdev.me/#/)
- [Hypixel Network API](http://api.hypixel.net/)
- [PlayerDB API](https://playerdb.co/)
- [SkyHelper API](https://github.com/Altpapier/SkyHelperAPI)
- [SkyCrypt](https://github.com/SkyCryptWebsite/SkyCrypt)
- [Senither](https://github.com/Senither)
- [LilyWeight](https://github.com/Antonio32A/lilyweight)
