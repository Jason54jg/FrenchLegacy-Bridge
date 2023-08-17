const config = require("../../config.json");
const { MongoClient, ObjectId } = require("mongodb");

class DB {
  #clientDb;

  constructor() {
    // Connect to database

    const uri = config.database.uri;
    const clientDb = new MongoClient(uri);
    clientDb.connect();
    this.clientDb = clientDb;
  }

  // Récupérer tout les utilisateurs
  async getUsers() {
    return await this.clientDb.db("dev").collection("users").find().toArray();
  }

  // Récupérer tout les utilisateurs par ordre décroissant de points
  async getUserByScoreOrder(currentPage, userPerPage) {
    if ((currentPage - 1) * userPerPage == 0) {
      return await this.clientDb
        .db("dev")
        .collection("users")
        .find({ score: { $ne: 0 } })
        .sort({ score: -1, _id: 1 })
        .limit(userPerPage)
        .toArray();
    }
    return await this.clientDb
      .db("dev")
      .collection("users")
      .find({ score: { $ne: 0 } })
      .sort({ score: -1, _id: 1 })
      .skip((currentPage - 1) * userPerPage)
      .limit(userPerPage)
      .toArray();
  }

  // Récupérer un utilisateur de la db
  async getUserById(discordId) {
    return await this.clientDb
      .db("dev")
      .collection("users")
      .findOne({ discordId: discordId });
  }

  async getUserByUuid(uuid) {
    return await this.clientDb
      .db("dev")
      .collection("users")
      .findOne({ uuid: uuid });
  }

  async getUserByUsername(username) {
    return await this.clientDb
      .db("dev")
      .collection("users")
      .findOne({ mc_username: username });
  }

  // Créer un utilisateur dans la db
  createUser(discordId) {
    const db = this.clientDb.db("dev");
    const newUser = {
      discordId: discordId,
      uuid: "",
      mc_username: "",
      score: 0,
      warn: 0,
    };
    db.collection("users").insertOne(newUser, function (err, res) {
      if (err) {
        throw err;
      }
      console.log(`user ${discordId} has been registered !`);
    });
  }

  // Avertir un utilisateur
  async warnUser(discordId) {
    let user = await this.getUserById(discordId);
    if (user == null) {
      return;
    }

    let updatedUser = {
      $set: {
        warn: user.warn + 10,
        score: user.score - 10,
      },
    };
    await this.clientDb
      .db("dev")
      .collection("users")
      .updateOne({ discordId: discordId }, updatedUser);
  }

  // Ajouter un nombre de point à l'utilisateur
  async addScoreToUser(discordId, score) {
    const user = await this.getUserById(discordId);
    if (user == null) {
      return;
    }

    let updatedUser = {
      $inc: {
        score: score,
      },
    };
    await this.clientDb
      .db("dev")
      .collection("users")
      .updateOne({ discordId: discordId }, updatedUser);
  }

  // Ajouter un nombre de point à tout les utilisateurs
  async addScoreToAll(score) {
    let updatedUser = {
      $inc: {
        score: score,
      },
    };
    await this.clientDb
      .db("dev")
      .collection("users")
      .updateMany({}, updatedUser);
  }

  // Définir un nombre de point à l'utilisateur
  async setScoreToUser(discordId, score) {
    const user = await this.getUserById(discordId);
    if (user == null) {
      return;
    }

    let updatedUser = {
      $set: {
        score: score,
      },
    };
    await this.clientDb
      .db("dev")
      .collection("users")
      .updateOne({ discordId: discordId }, updatedUser);
  }

  // Définir un nombre de point à tout les utilisateurs
  async setScoreToAll(score) {
    let updatedUser = {
      $set: {
        score: score,
      },
    };
    await this.clientDb
      .db("dev")
      .collection("users")
      .updateMany({}, updatedUser);
  }

  // Ajouter un nombre de warn à l'utilisateur
  async addWarnToUser(discordId, warn) {
    const user = await this.getUserById(discordId);
    if (user == null) {
      return;
    }

    let updatedUser = {
      $inc: {
        warn: warn,
      },
    };
    await this.clientDb
      .db("dev")
      .collection("users")
      .updateOne({ discordId: discordId }, updatedUser);
  }

  // Ajouter un nombre de warn à tout les utilisateurs
  async addWarnToAll(warn) {
    let updatedUser = {
      $inc: {
        warn: warn,
      },
    };
    await this.clientDb
      .db("dev")
      .collection("users")
      .updateMany({}, updatedUser);
  }

  // Définir un nombre de warn à l'utilisateur
  async setWarnToUser(discordId, warn) {
    const user = await this.getUserById(discordId);
    if (user == null) {
      return;
    }

    let updatedUser = {
      $set: {
        warn: warn,
      },
    };
    await this.clientDb
      .db("dev")
      .collection("users")
      .updateOne({ discordId: discordId }, updatedUser);
  }

  // Définir un nombre de warn à tout les utilisateurs
  async setWarnToAll(warn) {
    let updatedUser = {
      $set: {
        warn: warn,
      },
    };
    await this.clientDb
      .db("dev")
      .collection("users")
      .updateMany({}, updatedUser);
  }

  // ==================== Giveaway ====================
  // Récuperer un giveaway
  async getGiveaway(id) {
    return await this.clientDb
      .db("dev")
      .collection("giveaway")
      .findOne({ _id: new ObjectId(id) });
  }

  async getGiveaways() {
    return await this.clientDb
      .db("dev")
      .collection("giveaway")
      .find()
      .toArray();
  }

  // Créer un giveaway
  async createGiveaway(name, channel, endDate, host, winners) {
    const db = this.clientDb.db("dev");
    const newGiveaway = {
        name: name,
      channel: channel,
      host: host,
      winners: winners,
      endDate: endDate,
      participants: [],
    };
    return await db.collection("giveaway").insertOne(newGiveaway);
  }

  // Ajouter un participant a un giveaway
  async registerUserToGiveaway(id, discordId) {
    const giveaway = await this.getGiveaway(id);
    if (giveaway == null) {
      return;
    }

    const updatedGiveaway = {
      $push: {
        participants: discordId,
      },
    };

    await this.clientDb
      .db("dev")
      .collection("giveaway")
      .updateOne({ _id: new ObjectId(id) }, updatedGiveaway);
  }

  // Verifier si le joueur participe au giveaway
  async isUserParticipatingToGiveaway(id, discordId) {
    const res = await this.clientDb
      .db("dev")
      .collection("giveaway")
      .findOne({ _id: new ObjectId(id), participants: discordId });
    return res != null;
  }

  // Supprimer un giveaway
  deleteGiveaway(id) {
    this.clientDb
      .db("dev")
      .collection("giveaway")
      .findOneAndDelete({ _id: id });
  }
  // ========================================

  async addLinkedAccounts(discordId, uuid, mc_username) {
    if ((await this.getUserById(discordId)) == null) {
      return;
    }

    let updatedUser = {
      $set: {
        uuid: uuid,
        mc_username: mc_username,
      },
    };
    await this.clientDb
      .db("dev")
      .collection("users")
      .updateOne({ discordId: discordId }, updatedUser);
  }

  async getLinkedAccounts(discordId) {
    const result = await this.clientDb
      .db("dev")
      .collection("users")
      .findOne({ discordId: discordId, uuid: { $ne: null } });
    return result ? result.uuid : null;
  }
}

module.exports = new DB();
