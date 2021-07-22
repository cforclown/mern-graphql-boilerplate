process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = require("chai").expect;

const config = require("../src/config");
const Database = require("../src/database");
const database = new Database({
    nodeEnv: config.NODE_ENV,
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    dbName: config.DB_NAME,
});

describe("TESTING AUTH SERVICE", () => {
    let authService = null;
    let createdToken = null;

    // BEFORE TESTING
    before((done) => {
        database
            .connect()
            .then(() => {
                authService = require("../src/service/auth");
                done();
            })
            .catch((err) => done("An error occurred when starting the server"));
    });

    it("REGISTER", (done) => {
        if (!authService) {
            done("Auth service is undefined");
        }

        authService
            .register({
                username: "clown",
                email: "clown@gmail.com",
                fullname: "clown",
                password: "clown",
                confirmPassword: "clown",
            })
            .then((token) => {
                expect(token).to.be.an("object");
                expect(token).to.contain.property("userData");
                expect(token.userData).to.be.an("object");
                expect(token.userData).to.contain.property("userId");
                expect(token.userData).to.contain.property("username");
                expect(token.userData).to.contain.property("fullname");
                expect(token.userData).to.contain.property("avatar");
                expect(token.userData).to.contain.property("role");
                expect(token.userData.role).to.be.an("object");
                expect(token.userData.role).to.contain.property("_id");
                expect(token.userData.role).to.contain.property("name");
                expect(token).to.contain.property("accessToken");
                expect(token.accessToken).to.be.a("string");
                expect(token).to.contain.property("refreshToken");
                expect(token.refreshToken).to.be.a("string");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("LOGIN", (done) => {
        if (!authService) {
            done("Auth service is undefined");
        }

        authService
            .login({
                username: "clown",
                password: "clown",
            })
            .then((token) => {
                expect(token).to.be.an("object");
                expect(token).to.contain.property("userData");
                expect(token.userData).to.be.an("object");
                expect(token.userData).to.contain.property("userId");
                expect(token.userData).to.contain.property("username");
                expect(token.userData.username).to.equals("clown");
                expect(token.userData).to.contain.property("fullname");
                expect(token.userData).to.contain.property("avatar");
                expect(token.userData).to.contain.property("role");
                expect(token.userData.role).to.be.an("object");
                expect(token.userData.role).to.contain.property("_id");
                expect(token.userData.role).to.contain.property("name");
                expect(token).to.contain.property("accessToken");
                expect(token.accessToken).to.be.a("string");
                expect(token).to.contain.property("refreshToken");
                expect(token.refreshToken).to.be.a("string");

                createdToken = token;

                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("REFRESH TOKEN", (done) => {
        if (!authService) {
            done("Auth service is undefined");
        }
        if (!createdToken) {
            done("Created token is undefined");
        }

        authService
            .refresh(createdToken.refreshToken)
            .then((token) => {
                expect(token).to.be.an("object");
                expect(token).to.contain.property("userData");
                expect(token.userData).to.be.an("object");
                expect(token.userData).to.contain.property("userId");
                expect(token.userData).to.contain.property("username");
                expect(token.userData.username).to.equals("clown");
                expect(token.userData).to.contain.property("fullname");
                expect(token.userData).to.contain.property("avatar");
                expect(token.userData).to.contain.property("role");
                expect(token.userData.role).to.be.an("object");
                expect(token.userData.role).to.contain.property("_id");
                expect(token.userData.role).to.contain.property("name");
                expect(token).to.contain.property("accessToken");
                expect(token.accessToken).to.be.a("string");
                expect(token).to.contain.property("refreshToken");
                expect(token.refreshToken).to.be.a("string");

                createdToken = token;

                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("LOGOUT", (done) => {
        if (!authService) {
            done("Auth service is undefined");
        }
        if (!createdToken) {
            done("Created token is undefined");
        }

        authService
            .logout(createdToken.accessToken)
            .then((result) => {
                expect(result).to.be.an("boolean");
                expect(result).to.equals(true);

                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
});
