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

describe("TESTING ROLE SERVICEs", () => {
    let roleService = null;
    let createdRole = null;

    // BEFORE TESTING
    before((done) => {
        database
            .connect()
            .then(() => {
                roleService = require("../src/service/role");
                done();
            })
            .catch((err) => done(err));
    });

    it("CREATE", (done) => {
        roleService
            .create({ name: "test" })
            .then((role) => {
                expect(role).to.be.an("object");
                createdRole = role;
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });

    it("GET", (done) => {
        roleService
            .get(createdRole._id)
            .then((role) => {
                expect(role).to.be.an("object");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("GET ALL", (done) => {
        roleService
            .getAll()
            .then((roleList) => {
                expect(roleList).to.be.an("array");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("SEARCH", (done) => {
        roleService
            .search({
                query: "a",
                pagination: {
                    page: 1,
                    limit: 10,
                    sort: { by: "NAME", order: "ASC" },
                },
            })
            .then((data) => {
                expect(data).to.be.an("object");
                expect(data).to.have.property("pagination");
                expect(data).to.have.property("data");
                expect(data.data).to.be.an("array");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });

    it("UPDATE", (done) => {
        roleService
            .update({
                _id: createdRole._id,
                name: "test update",
            })
            .then((result) => {
                expect(result).to.be.an("object");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });

    it("DELETE", (done) => {
        roleService
            .delete(createdRole._id.toString())
            .then((deletedRole) => {
                expect(deletedRole).to.be.an("object");
                expect(deletedRole).to.have.property("_id");
                expect(deletedRole).to.have.property("name");
                expect(deletedRole).to.have.property("user");
                expect(deletedRole).to.have.property("masterData");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
});
