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
const mockData = require("../test-mock-data");

describe("TESTING AVATAR SERVICEs", () => {
    let avatarService = null;
    let createdAvatarId = null;

    // BEFORE TESTING
    before((done) => {
        database
            .connect()
            .then(() => {
                avatarService = require("../src/service/avatar");
                done();
            })
            .catch((err) => done(err));
    });

    it("CREATE", (done) => {
        avatarService
            .create({
                filename: "filename",
                file: "data:image/jpeg;base64,/9j/4AAQSkZJRg",
            })
            .then((avatarId) => {
                expect(avatarId).to.be.an("string");
                createdAvatarId = avatarId;
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("GET", (done) => {
        avatarService
            .get(createdAvatarId)
            .then((avatar) => {
                expect(avatar).to.be.an("object");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("UPDATE", (done) => {
        avatarService
            .create({
                _id: createdAvatarId,
                filename: "filename",
                file: "data:image/jpeg;base64,/9j/4AAQSkZJRg",
            })
            .then((avatarId) => {
                expect(avatarId).to.be.an("string");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("DELETE", (done) => {
        avatarService
            .delete(createdAvatarId)
            .then((avatarId) => {
                expect(avatarId).to.be.an("string");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
});
