const config = require("../../config.json");
const { MongoClient } = require('mongodb');

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

    // Récupérer un utilisateur de la db
    async getUserByUuid(uuid) {
        return await this.clientDb.db("dev").collection("users").findOne({ uuid: uuid });
    }

    async getUserByUsername(username) {
        return await this.clientDb.db("dev").collection("users").findOne({ mc_username: username });
    }

    // Créer un utilisateur dans la db
    createUser(uuid, name) {
        const db = this.clientDb.db("dev");
        const newUser = {
            uuid: uuid,
            mc_username: name,
            score: 0,
            warn: 0
        }
        db.collection("users").insertOne(newUser, function (err, res) {
            if (err) throw err;
            console.log(`user ${name} (${uuid}) has been registered !`);
        })
    }

    // Avertir un utilisateur
    async warnUser(uuid) {
        let user = await this.getUserByUuid(uuid);
        if (user == null) { return; }

        let updatedUser = {
            $set: {
                warn: (user.warn+10),
                score: (user.score-10)
            }
        }
        await this.clientDb.db("dev").collection("users").updateOne({ uuid: uuid }, updatedUser);
    }

    // Ajouter un nombre de point à l'utilisateur
    async addScoreToUser(uuid, score) {
        const user = await this.getUserByUuid(uuid);
        if (user == null) { return; }

        let updatedUser = {
            $set: {
                score: user.score + score
            }
        }
        await this.clientDb.db("dev").collection("users").updateOne({ uuid: uuid }, updatedUser);
    }
}

module.exports = new DB();