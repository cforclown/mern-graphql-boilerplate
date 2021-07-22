"use strict";

const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const expressSession = require("express-session");
const expressFlash = require("express-flash");
const cors = require("cors");
const fs = require("fs");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const swaggerSchemas = require("../swagger-schemas");

class App {
    constructor({ nodeEnv, port, appHost, sessionConfig, accessTokenConfig }) {
        this.config = { nodeEnv, port, appHost, sessionConfig, accessTokenConfig };
        this.app = express();

        //#region =========================== CONFIG MIDDLEWARE ===========================
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json({ limit: "10mb" }));
        this.app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

        // CORS
        this.app.use(
            cors({
                origin: appHost,
                credentials: true,
            })
        );

        this.app.use(expressFlash());
        this.app.use(
            expressSession({
                secret: sessionConfig.secret,
                resave: sessionConfig.resave,
                saveUninitialized: sessionConfig.saveUninitialized,
                cookie: {
                    secure: sessionConfig.cookieSecure,
                    maxAge: sessionConfig.cookieMaxAge,
                },
            })
        );
        this.app.use(cookieParser(sessionConfig.secret));
        //#endregion =======================================================================

        //#region ============================ SWAGGER CONFIG =============================
        // extended : https://swagger.io/specification/#infoObject
        const swaggerOptions = {
            definition: {
                openapi: "3.0.0",
                info: {
                    title: "API",
                    version: "1.0.0",
                    description: "API Documentation",
                    contact: {
                        name: "Hafis Alrizal",
                        url: "https://hafisalrizal.com",
                        email: "hafisalrizal@gmail.com",
                    },
                },
                consumes: ["application/json"],
                produces: ["application/json"],
                schemes: ["http", "https"],
                components: {
                    schemas: swaggerSchemas,
                    securitySchemes: {
                        Bearer: {
                            type: "apiKey",
                            name: "Authorization",
                            in: "header",
                        },
                    },
                },
                securityDefinitions: {
                    Bearer: {
                        type: "apiKey",
                        name: "Authorization",
                        in: "header",
                    },
                },
                security: {
                    Bearer: [],
                },
            },
            apis: ["./src/router/api/router/*.js", "./src/router/auth/*.js"],
        };
        const swaggerDocs = swaggerJsDoc(swaggerOptions);
        this.app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
        //#endregion -----------------------------------------------------------------------

        this.app.set("port", port);
    }

    initAuth() {
        // INIT PASSPORT CONFIGURATION
        const initPassportConfig = require("../passport-config");
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        initPassportConfig(passport);

        const authRouter = require("../router/auth");
        this.app.use("/auth", authRouter);
    }
    initApi() {
        const apiRouter = require("../router/api");
        this.app.use("/api", apiRouter);
    }
    initPublic(publicPath, defaultPublicPath) {
        if (fs.existsSync(path.join(__dirname, publicPath))) {
            this.app.use(express.static(path.join(__dirname, publicPath)));
            this.app.get("/*", (req, res) => {
                res.sendFile(path.join(__dirname, publicPath + "/index.html"));
            });
        } else {
            this.app.use(express.static(path.join(__dirname, defaultPublicPath)));
            this.app.get("/*", (req, res) => {
                res.sendFile(path.join(__dirname, defaultPublicPath + "/index.html"));
            });
        }
    }

    initGraphql(schema) {
        const { graphqlHTTP } = require("express-graphql");
        this.app.use(
            "/graphql",
            graphqlHTTP({
                schema: schema,
                graphiql: {
                    headerEditorEnabled: true,
                },
            })
        );
    }

    async start() {
        await this.app.listen(this.app.get("port"));
    }
}

module.exports = App;
