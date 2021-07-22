process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = require("chai").expect;
const request = require("supertest");
const Server = require("../src/server");
const mockData = require("../test-mock-data");

describe("TESTING /api/role", () => {
    const server = new Server();

    let adminUserToken = null;
    let normalUserToken = null;
    let createdRole = null;

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
        it("GET ALL ROLE", (done) => {
            request(server.app.app)
                .get("/api/role")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("array");

                    roleList = data;

                    done();
                });
        });

        it("SEARCH ROLEs", (done) => {
            request(server.app.app)
                .post("/api/role/search")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .send({ query: "a" })
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

                    done();
                });
        });

        it("GET ROLE BY ID", (done) => {
            request(server.app.app)
                .get("/api/role/" + mockData.roles[0]._id)
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
        it("CREATE ROLE", (done) => {
            request(server.app.app)
                .post("/api/role")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .send({ name: "test role" })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("object");

                    createdRole = data;

                    done();
                });
        });

        it("CREATE ROLE - BAD REQUEST", (done) => {
            request(server.app.app)
                .post("/api/role")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(400);
                    done();
                });
        });

        it("CREATE ROLE - UNAUTHORIZED", (done) => {
            request(server.app.app)
                .post("/api/role")
                .set({ Authorization: `Bearer ${normalUserToken.accessToken}` })
                .send({ name: "test role" })
                .end((err, response) => {
                    expect(response.status).to.equal(403);
                    done();
                });
        });
    });

    describe("[PUT]", () => {
        it("UPDATE ROLE", (done) => {
            request(server.app.app)
                .put("/api/role")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .send({
                    _id: createdRole._id,
                    name: "update role name",
                    user: { view: true, create: true, update: true, delete: true },
                    masterData: { view: true, create: true, update: true, delete: true },
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

        it("UPDATE ROLE - BAD REQUEST", (done) => {
            request(server.app.app)
                .put("/api/role")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(400);
                    done();
                });
        });

        it("UPDATE ROLE - UNAUTHORIZED", (done) => {
            request(server.app.app)
                .put("/api/role")
                .set({ Authorization: `Bearer ${normalUserToken.accessToken}` })
                .send({
                    _id: createdRole._id,
                    name: "update role name",
                    user: { view: true, create: true, update: true, delete: true },
                    masterData: { view: true, create: true, update: true, delete: true },
                })
                .end((err, response) => {
                    expect(response.status).to.equal(403);
                    done();
                });
        });
    });

    describe("[DELETE]", () => {
        it("DELETE ROLE", (done) => {
            request(server.app.app)
                .delete("/api/role/" + createdRole._id)
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
});
