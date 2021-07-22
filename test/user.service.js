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

describe("TESTING USER SERVICEs", () => {
    let userService = null;
    let createdUser = null;

    // BEFORE TESTING
    before((done) => {
        database
            .connect()
            .then(() => {
                userService = require("../src/service/user");
                done();
            })
            .catch((err) => done(err));
    });

    it("CREATE", (done) => {
        userService
            .create({
                username: "create",
                email: "create@gmail.com",
                fullname: "create",
                role: mockData.roles[0]._id,
            })
            .then((user) => {
                expect(user).to.be.an("object");
                expect(user).to.have.property("_id");
                expect(user).to.have.property("username");
                expect(user).to.have.property("email");
                expect(user).to.have.property("fullname");
                expect(user).to.have.property("role");
                expect(user.role).to.be.an("object");
                expect(user.role).to.have.property("_id");
                expect(user.role).to.have.property("name");

                createdUser = user;
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });

    it("GET", (done) => {
        if (!createdUser) {
            done("Created user is undefined");
        }

        userService
            .get(createdUser._id)
            .then((user) => {
                expect(user).to.be.an("object");
                expect(user).to.have.property("_id");
                expect(user).to.have.property("username");
                expect(user).to.have.property("email");
                expect(user).to.have.property("fullname");
                expect(user).to.have.property("role");
                expect(user.role).to.be.an("object");
                expect(user.role).to.have.property("_id");
                expect(user.role).to.have.property("name");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("GET USER PERMISSIONS", (done) => {
        if (!createdUser) {
            done("Created user is undefined");
        }

        userService
            .getUserPermissions(createdUser._id)
            .then((permissions) => {
                expect(permissions).to.be.an("object");
                expect(permissions).to.have.property("_id");
                expect(permissions).to.have.property("name");
                expect(permissions).to.have.property("user");
                expect(permissions.user).to.be.a("object");
                expect(permissions.user).to.have.property("view");
                expect(permissions.user).to.have.property("create");
                expect(permissions.user).to.have.property("update");
                expect(permissions.user).to.have.property("delete");
                expect(permissions).to.have.property("masterData");
                expect(permissions.masterData).to.be.a("object");
                expect(permissions.masterData).to.have.property("view");
                expect(permissions.masterData).to.have.property("create");
                expect(permissions.masterData).to.have.property("update");
                expect(permissions.masterData).to.have.property("delete");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("GET ALL", (done) => {
        userService
            .getAll()
            .then((users) => {
                expect(users).to.be.an("array");
                expect(users[0]).to.be.an("object");
                expect(users[0]).to.have.property("_id");
                expect(users[0]).to.have.property("username");
                expect(users[0]).to.have.property("email");
                expect(users[0]).to.have.property("fullname");
                expect(users[0]).to.have.property("role");
                expect(users[0].role).to.be.an("object");
                expect(users[0].role).to.have.property("_id");
                expect(users[0].role).to.have.property("name");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("SEARCH", (done) => {
        userService
            .search({
                query: "a",
                pagination: {
                    page: 1,
                    limit: 10,
                    sort: {
                        by: "FULLNAME",
                        order: "ASC",
                    },
                },
            })
            .then((data) => {
                expect(data).to.be.an("object");
                expect(data).to.have.property("pagination");
                expect(data).to.have.property("data");
                expect(data.data).to.be.an("array");
                expect(data.data[0]).to.be.an("object");
                expect(data.data[0]).to.have.property("_id");
                expect(data.data[0]).to.have.property("username");
                expect(data.data[0]).to.have.property("email");
                expect(data.data[0]).to.have.property("fullname");
                expect(data.data[0]).to.have.property("role");
                expect(data.data[0].role).to.be.an("object");
                expect(data.data[0].role).to.have.property("_id");
                expect(data.data[0].role).to.have.property("name");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });

    it("GET PROFILE", (done) => {
        if (!createdUser) {
            done("Created user is undefined");
        }

        userService
            .getProfile(createdUser._id)
            .then((user) => {
                expect(user).to.be.an("object");
                expect(user).to.have.property("_id");
                expect(user).to.have.property("username");
                expect(user).to.have.property("email");
                expect(user).to.have.property("fullname");
                expect(user).to.have.property("role");
                expect(user.role).to.be.an("object");
                expect(user.role).to.have.property("_id");
                expect(user.role).to.have.property("name");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("UPDATE PROFILE", (done) => {
        if (!createdUser) {
            done("Created user is undefined");
        }

        userService
            .updateProfile(createdUser._id, { email: "create2@gmail.com", fullname: "update fullname" })
            .then((result) => {
                expect(result).to.be.an("object");
                expect(result).to.have.property("email");
                expect(result).to.have.property("fullname");
                userService
                    .get(createdUser._id)
                    .then((user) => {
                        expect(user).to.be.an("object");
                        expect(user).to.have.property("_id");
                        expect(user).to.have.property("username");
                        expect(user).to.have.property("email");
                        expect(user.email).to.equal("create2@gmail.com");
                        expect(user).to.have.property("fullname");
                        expect(user.fullname).to.equal("update fullname");
                        expect(user).to.have.property("role");
                        expect(user.role).to.be.an("object");
                        expect(user.role).to.have.property("_id");
                        expect(user.role).to.have.property("name");
                        done();
                    })
                    .catch((err) => {
                        done(err.message);
                    });
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("CHANGE USERNAME", (done) => {
        if (!createdUser) {
            done("Created user is undefined");
        }

        userService
            .changeUsername(createdUser._id, "new_username")
            .then((result) => {
                expect(result).to.be.an("string");
                expect(result).to.equal("new_username");
                userService
                    .get(createdUser._id)
                    .then((user) => {
                        expect(user).to.be.an("object");
                        expect(user).to.have.property("_id");
                        expect(user).to.have.property("username");
                        expect(user.username).to.equal("new_username");
                        expect(user).to.have.property("email");
                        expect(user).to.have.property("fullname");
                        expect(user).to.have.property("role");
                        expect(user.role).to.be.an("object");
                        expect(user.role).to.have.property("_id");
                        expect(user.role).to.have.property("name");
                        done();
                    })
                    .catch((err) => {
                        done(err.message);
                    });
            })
            .catch((err) => {
                done(err.message);
            });
    });

    it("UPDATE", (done) => {
        if (!createdUser) {
            done("Created user is undefined");
        }

        userService
            .update({
                _id: createdUser._id,
                role: mockData.roles[1]._id,
            })
            .then((result) => {
                expect(result).to.be.an("object");
                expect(result).to.have.property("_id");
                expect(result).to.have.property("role");
                userService
                    .get(createdUser._id)
                    .then((user) => {
                        expect(user).to.be.an("object");
                        expect(user).to.have.property("_id");
                        expect(user).to.have.property("username");
                        expect(user).to.have.property("email");
                        expect(user).to.have.property("fullname");
                        expect(user).to.have.property("role");
                        expect(user.role).to.be.an("object");
                        expect(user.role).to.have.property("_id");
                        expect(user.role).to.have.property("name");
                        expect(user.role.name).to.equal(mockData.roles[1].name);
                        done();
                    })
                    .catch((err) => {
                        done(err.message);
                    });
            })
            .catch((err) => {
                done(err.message);
            });
    });

    it("DELETE", (done) => {
        if (!createdUser) {
            done("Created user is undefined");
        }

        userService
            .delete(createdUser._id.toString())
            .then((deletedUserId) => {
                expect(deletedUserId).to.be.an("string");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
});
