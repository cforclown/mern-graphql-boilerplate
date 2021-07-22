process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = require("chai").expect;
const request = require("supertest");
const Server = require("../src/server");
const mockData = require("../test-mock-data");

describe("TESTING /api/user", () => {
    const server = new Server();
    let adminUserToken = null;
    let normalUserToken = null;
    let createdUser = null;

    before((done) => {
        server
            .startForTest()
            .then(() => done())
            .catch((err) => done("An error occurred when starting the server"));
    });

    // LOGIN BEFORE EVERY TEST
    beforeEach(async () => {
        try {
            let response = await request(server.app.app).post("/auth/login/test").send({ username: "admin", password: "root" });
            expect(response.status).to.satisfy((status) => status == 200 || status == 302);
            expect(response).to.contain.property("text");

            let responseJson = JSON.parse(response.text);
            expect(responseJson).to.be.an("object");
            expect(responseJson).to.contain.property("data");
            expect(responseJson.data).to.contain.property("userData");
            expect(responseJson.data).to.contain.property("accessToken");
            expect(responseJson.data).to.contain.property("refreshToken");

            adminUserToken = responseJson.data;

            response = await request(server.app.app).post("/auth/login/test").send({ username: "normal", password: "root" });
            expect(response.status).to.satisfy((status) => status == 200 || status == 302);
            expect(response).to.contain.property("text");

            responseJson = JSON.parse(response.text);
            expect(responseJson).to.be.an("object");
            expect(responseJson).to.contain.property("data");
            expect(responseJson.data).to.contain.property("userData");
            expect(responseJson.data).to.contain.property("accessToken");
            expect(responseJson.data).to.contain.property("refreshToken");

            normalUserToken = responseJson.data;
        } catch (err) {
            console.log(err.message);
        }
    });

    describe("[GET]", () => {
        it("GET USER LIST", (done) => {
            request(server.app.app)
                .get("/api/user")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const users = body.data;
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
                });
        });

        it("GET USER BY ID", (done) => {
            request(server.app.app)
                .get("/api/user/" + mockData.users[0]._id)
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const user = body.data;
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
                });
        });

        it("GET USER PERMISSIONS", (done) => {
            request(server.app.app)
                .get("/api/user/permissions/" + mockData.users[0]._id)
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("object");

                    done();
                });
        });
    });

    describe("[POST]", () => {
        it("CREATE USER", (done) => {
            request(server.app.app)
                .post("/api/user")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .send({
                    username: "new_user_username",
                    email: "new_user_username@gmail.com",
                    fullname: "new_user_username",
                    role: mockData.roles[0]._id,
                })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("object");

                    createdUser = data;

                    done();
                });
        });

        it("CREATE USER [FAILED]", (done) => {
            request(server.app.app)
                .post("/api/user")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .send({
                    username: "new_user_username",
                    email: "new_user_username@gmail.com",
                    fullname: "new_user_username",
                    role: mockData.roles[0]._id,
                })
                .end((err, response) => {
                    expect(response.status).to.equal(400);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("msg");

                    console.log(body.msg);

                    done();
                });
        });

        it("SEARCH USERs", (done) => {
            request(server.app.app)
                .post("/api/user/search")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .send({ query: "", pagination: { page: 1, limit: 10, sort: { by: "FULLNAME", order: "DESC" } } })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
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
                });
        });

        it("CREATE USER - BAD REQUEST", (done) => {
            request(server.app.app)
                .post("/api/user")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(400);
                    done();
                });
        });

        it("CREATE USER - UNAUTHORIZED", (done) => {
            request(server.app.app)
                .post("/api/user")
                .set({ Authorization: `Bearer ${normalUserToken.accessToken}` })
                .send({
                    username: "a",
                    email: "a@gmail.com",
                    fullname: "a",
                    role: mockData.roles[0]._id,
                })
                .end((err, response) => {
                    expect(response.status).to.equal(403);
                    done();
                });
        });
    });

    describe("[PUT]", () => {
        it("UPDATE USER", (done) => {
            request(server.app.app)
                .put("/api/user")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .send({
                    _id: createdUser._id,
                    role: mockData.roles[1]._id,
                })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("object");

                    done();
                });
        });

        it("UPDATE USER - BAD REQUEST", (done) => {
            request(server.app.app)
                .put("/api/user")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(400);
                    done();
                });
        });

        it("UPDATE USER - UNAUTHORIZED", (done) => {
            request(server.app.app)
                .put("/api/user")
                .set({ Authorization: `Bearer ${normalUserToken.accessToken}` })
                .send({
                    _id: createdUser._id,
                    role: mockData.roles[1]._id,
                })
                .end((err, response) => {
                    expect(response.status).to.equal(403);
                    done();
                });
        });
    });

    describe("[DELETE]", () => {
        it("DELETE USER", (done) => {
            request(server.app.app)
                .delete("/api/user/" + createdUser._id)
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("string");

                    done();
                });
        });
    });

    describe("[PROFILE]", () => {
        it("GET USER PROFILE", (done) => {
            request(server.app.app)
                .get("/api/user/profile/" + mockData.users[0]._id)
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("object");

                    done();
                });
        });

        it("UPDATE USER PROFILE", (done) => {
            request(server.app.app)
                .put("/api/user/profile")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .send({
                    email: "hehe@gmail.com",
                    fullname: "hehe hehe",
                })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("object");

                    done();
                });
        });

        it("CHANGE USERNAME", (done) => {
            request(server.app.app)
                .put("/api/user/profile/username")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .send({
                    username: "edit",
                })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("string");

                    createdUser.username = data;

                    done();
                });
        });
    });
});
