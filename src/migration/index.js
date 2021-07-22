const config = require("../config");
const mongoose = require("mongoose");
const Database = require("../database");
const cl = require("../console-log");
const initialData = require("./mongodb-initial-data");

async function migrate() {
    try {
        const database = new Database({
            nodeEnv: config.NODE_ENV,
            host: config.DB_HOST,
            port: config.DB_PORT,
            username: config.DB_USERNAME,
            password: config.DB_PASSWORD,
            dbName: config.DB_NAME,
        });
        await database.connect();

        const roleModel = mongoose.model("Role");
        const userModel = mongoose.model("User");
        if ((await roleModel.find({}).exec()).length === 0) {
            for (const data of initialData.roles) {
                const doc = new roleModel(data);
                await doc.save();
            }
        }
        if ((await userModel.find({}).exec()).length === 0) {
            for (const data of initialData.users) {
                const doc = new userModel(data);
                await doc.save();
            }
        }
        cl.LogBgSuccess("===================== !!! MIGRATION COMPLETE !!! ====================");
        cl.LogBgSuccess("=====================================================================");
        cl.LogSuccess("| 'npm run dev' or 'npm run watch-dev' to start development mode");
        cl.LogSuccess("| 'npm run prod' to start production mode");
        cl.LogSuccess("| 'npm run test' to run unit-testing");
        cl.LogSuccess("| 'npm run test-coverage' unit-test report");
        cl.LogSuccess("| 'npm run test-routers' to test routers only");
        cl.LogSuccess("| 'npm run test-services' to test services only");
        cl.LogBgSuccess("=====================================================================");
    } catch (err) {
        cl.LogError("!!! MIGRATION FAILED !!!");
        cl.LogError(err.message);
    }
}

migrate().then(() => process.exit());
