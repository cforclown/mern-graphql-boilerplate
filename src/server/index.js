"use strict";

const config = require("../config");
const Database = require("../database");
const App = require("../app");
const ErrorDump = require("../error/error-dump");
const cl = require("../console-log");

class Server {
    constructor() {
        this.db = new Database({
            nodeEnv: config.NODE_ENV,
            host: config.DB_HOST,
            port: config.DB_PORT,
            username: config.DB_USERNAME,
            password: config.DB_PASSWORD,
            dbName: config.DB_NAME,
        });
        this.app = new App({
            nodeEnv: config.NODE_ENV,
            port: config.PORT,
            appHost: config.APP_HOST.split(" "),
            sessionConfig: {
                secret: config.SESSION_SECRET,
                resave: config.SESSION_RESAVE,
                saveUninitialized: config.SESSION_SAVE_UNINITIALIZED,
                cookieSecure: false,
                cookieMaxAge: parseInt(config.SESSION_COOKIE_MAX_AGE),
            },
            accessTokenConfig: {
                accessTokenSecret: config.ACCESS_TOKEN_SECRET,
                refreshTokenSecret: config.REFRESH_TOKEN_SECRET,
                accessTokenExpIn: parseInt(config.ACCESS_TOKEN_EXP_IN),
            },
        });
        this.publicPath =
            config.NODE_ENV === "development" ? "../../public/staging" : config.NODE_ENV === "production" ? "../../public/production" : "../../public/default";
    }
    async start() {
        try {
            await this.db.connect();
            cl.LogBgSuccess("============================================================================");
            cl.LogSuccess(`| ${config.NODE_ENV.toUpperCase()} MODE`);
            cl.LogSuccess(`| DATABASE CONNECTED [${config.DB_NAME}]`);

            this.app.initAuth();
            this.app.initApi();
            const graphqlSchema = require("../graphql");
            this.app.initGraphql(graphqlSchema);
            this.app.initPublic(this.publicPath, "../../public/default");
            await this.app.start();
            cl.LogSuccess(`| SERVER LISTENING ON PORT ${this.app.config.port}`);
            cl.LogBgSuccess("============================================================================");
        } catch (err) {
            ErrorDump(err);
            cl.LogError("!! DATABASE CONNECTION FAILED: " + err.message);
        }
    }
    async startForTest() {
        try {
            await this.db.connect();
            this.app.initAuth();
            this.app.initApi();
            const graphqlSchema = require("../graphql");
            this.app.initGraphql(graphqlSchema);
            cl.LogBgSuccess(`${config.NODE_ENV.toUpperCase()} MODE ======================================`);
        } catch (err) {
            ErrorDump(err);
            cl.LogError("!! DATABASE CONNECTION FAILED: " + err.message);
        }
    }
}

module.exports = Server;
