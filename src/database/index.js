const mongoose = require("mongoose");

class Database {
    constructor({ nodeEnv, host, port, username, password, dbName }) {
        this.config = { nodeEnv, host, port, username, password, dbName };
    }
    async connect() {
        const dburl = `mongodb://${this.config.host}:${this.config.port}/${this.config.dbName}`;
        const options = {
            auth: { authSource: "admin" },
            user: this.config.username,
            pass: this.config.password,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        if (this.config.nodeEnv === "test") {
            const Mockgoose = require("mockgoose").Mockgoose;
            const mockgoose = new Mockgoose(mongoose);

            await mockgoose.prepareStorage();

            await mongoose.connect(dburl, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
            });

            this.registerModels();
            await this.createTestMockData();
        } else {
            await mongoose.connect(dburl, options);
            this.registerModels();
        }
    }

    close() {
        if (NOVE) return mongoose.disconnect();
    }

    registerModels() {
        require("./model/user.model").Model;
        require("./model/role.model").Model;
        require("./model/avatar.model").Model;
        require("./model/token.model").Model;
    }
    async createTestMockData() {
        try {
            const mockData = require("../../test-mock-data");
            const roleModel = mongoose.model("Role");
            const avatarModel = mongoose.model("Avatar");
            const userModel = mongoose.model("User");
            if ((await roleModel.find({}).exec()).length === 0) {
                for (const data of mockData.roles) {
                    const doc = new roleModel(data);
                    await doc.save();
                }
            }
            if ((await avatarModel.find({}).exec()).length === 0) {
                for (const data of mockData.avatars) {
                    const doc = new avatarModel(data);
                    await doc.save();
                }
            }
            let users = await userModel.find({}).exec();
            users = users.map((user) => user.toObject());
            if ((await userModel.find({}).exec()).length === 0) {
                for (const data of mockData.users) {
                    const doc = new userModel(data);
                    await doc.save();
                }
            }
        } catch (err) {
            console.log("CREATE TEST MOCK DATA FAILED !! " + err.message);
        }
    }
}

module.exports = Database;
