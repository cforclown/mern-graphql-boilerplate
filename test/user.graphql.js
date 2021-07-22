process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = require("chai").expect;
const request = require("supertest");
const Server = require("../src/server");
const mockData = require("../test-mock-data");

function createUserRequestBody(username, email, fullname, role) {
    return {
        query: `mutation {
            createUser(username:"${username}", email:"${email}", fullname:"${fullname}", role:"${role}") {
                _id
                username
                email
                fullname
                avatar
                role
            }
        }`,
    };
}
function updateUserRequestBody(userId, role) {
    return {
        query: `mutation {
            updateUser(_id: "${userId}", role:"${role}") {
                _id
                username
                email
                fullname
                avatar
                role
            }
        }`,
    };
}
function deleteUserRequestBody(userId) {
    return {
        query: `mutation {
            deleteUser(userId:"${userId}")
        }`,
    };
}
function getUserRequestBody(userId) {
    return {
        query: `query {
            user(userId:"${userId}") {
                _id
                username
                email
                fullname
                avatar
                role {
                    _id
                    name
                }
            }
        }`,
    };
}

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

    describe("[POST]", () => {
        it("CREATE USER", (done) => {
            request(server.app.app)
                .post("/graphql")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .send(createUserRequestBody("username", "email@gmail.com", "fullname", mockData.roles[0]._id))
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");
                    expect(body.data).to.be.an("object");
                    expect(body.data).to.contain.property("createUser");
                    expect(body.data.createUser).to.be.an("object");
                    expect(body.data.createUser).to.contain.property("_id");
                    expect(body.data.createUser).to.contain.property("username");
                    expect(body.data.createUser).to.contain.property("email");
                    expect(body.data.createUser).to.contain.property("fullname");
                    expect(body.data.createUser).to.contain.property("avatar");
                    expect(body.data.createUser).to.contain.property("role");

                    createdUser = body.data.createUser;

                    request(server.app.app)
                        .post("/graphql")
                        .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                        .send(getUserRequestBody(createdUser._id))
                        .end((err, response) => {
                            expect(response.status).to.equal(200);
                            expect(response).to.contain.property("text");

                            const body = JSON.parse(response.text);
                            expect(body).to.be.an("object");
                            expect(body).to.contain.property("data");
                            expect(body.data).to.be.an("object");
                            expect(body.data).to.contain.property("user");
                            expect(body.data.user).to.be.an("object");
                            expect(body.data.user).to.contain.property("_id");
                            expect(body.data.user).to.contain.property("username");
                            expect(body.data.user).to.contain.property("email");
                            expect(body.data.user).to.contain.property("fullname");
                            expect(body.data.user).to.contain.property("avatar");
                            expect(body.data.user).to.contain.property("role");

                            done();
                        });
                });
        });
        it("UPDATE USER", (done) => {
            request(server.app.app)
                .post("/graphql")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .send(createUserRequestBody("update", "update@gmail.com", "update", mockData.roles[0]._id))
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");
                    expect(body.data).to.be.an("object");
                    expect(body.data).to.contain.property("createUser");
                    expect(body.data.createUser).to.be.an("object");
                    expect(body.data.createUser).to.contain.property("_id");
                    expect(body.data.createUser).to.contain.property("username");
                    expect(body.data.createUser).to.contain.property("email");
                    expect(body.data.createUser).to.contain.property("fullname");
                    expect(body.data.createUser).to.contain.property("avatar");
                    expect(body.data.createUser).to.contain.property("role");

                    createdUser = body.data.createUser;

                    request(server.app.app)
                        .post("/graphql")
                        .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                        .send(updateUserRequestBody(createdUser._id, mockData.roles[1]._id))
                        .end((err, response) => {
                            expect(response.status).to.equal(200);
                            expect(response).to.contain.property("text");

                            const body = JSON.parse(response.text);
                            expect(body).to.be.an("object");
                            expect(body).to.contain.property("data");
                            expect(body.data).to.be.an("object");
                            expect(body.data).to.contain.property("updateUser");
                            expect(body.data.updateUser).to.be.an("object");
                            expect(body.data.updateUser).to.contain.property("_id");
                            expect(body.data.updateUser).to.contain.property("username");
                            expect(body.data.updateUser).to.contain.property("email");
                            expect(body.data.updateUser).to.contain.property("fullname");
                            expect(body.data.updateUser).to.contain.property("avatar");
                            expect(body.data.updateUser).to.contain.property("role");

                            request(server.app.app)
                                .post("/graphql")
                                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                                .send(getUserRequestBody(createdUser._id))
                                .end((err, response) => {
                                    expect(response.status).to.equal(200);
                                    expect(response).to.contain.property("text");

                                    const body = JSON.parse(response.text);
                                    expect(body).to.be.an("object");
                                    expect(body).to.contain.property("data");
                                    expect(body.data).to.be.an("object");
                                    expect(body.data).to.contain.property("user");
                                    expect(body.data.user).to.be.an("object");
                                    expect(body.data.user).to.contain.property("_id");
                                    expect(body.data.user).to.contain.property("username");
                                    expect(body.data.user).to.contain.property("email");
                                    expect(body.data.user).to.contain.property("fullname");
                                    expect(body.data.user).to.contain.property("avatar");
                                    expect(body.data.user).to.contain.property("role");

                                    done();
                                });
                        });
                });
        });
        it("DELETE USER", (done) => {
            request(server.app.app)
                .post("/graphql")
                .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                .send(createUserRequestBody("delete", "delete@gmail.com", "delete", mockData.roles[0]._id))
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");
                    expect(body.data).to.be.an("object");
                    expect(body.data).to.contain.property("createUser");
                    expect(body.data.createUser).to.be.an("object");
                    expect(body.data.createUser).to.contain.property("_id");
                    expect(body.data.createUser).to.contain.property("username");
                    expect(body.data.createUser).to.contain.property("email");
                    expect(body.data.createUser).to.contain.property("fullname");
                    expect(body.data.createUser).to.contain.property("avatar");
                    expect(body.data.createUser).to.contain.property("role");

                    createdUser = body.data.createUser;

                    request(server.app.app)
                        .post("/graphql")
                        .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                        .send(deleteUserRequestBody(createdUser._id))
                        .end((err, response) => {
                            expect(response.status).to.equal(200);
                            expect(response).to.contain.property("text");

                            const body = JSON.parse(response.text);
                            expect(body).to.be.an("object");
                            expect(body).to.contain.property("data");
                            expect(body.data).to.be.an("object");
                            expect(body.data).to.contain.property("deleteUser");
                            expect(body.data.deleteUser).to.be.an("string");

                            done();
                        });
                });
        });

        // it("SEARCH USERs", (done) => {
        //     request(server.app.app)
        //         .post("/api/user/search")
        //         .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
        //         .send({ query: "", pagination: { page: 1, limit: 10, sort: { by: "FULLNAME", order: "DESC" } } })
        //         .end((err, response) => {
        //             expect(response.status).to.equal(200);
        //             expect(response).to.contain.property("text");

        //             const body = JSON.parse(response.text);
        //             expect(body).to.be.an("object");
        //             expect(body).to.contain.property("data");

        //             const data = body.data;
        //             expect(data).to.be.an("object");
        //             expect(data).to.have.property("pagination");
        //             expect(data).to.have.property("data");
        //             expect(data.data).to.be.an("array");
        //             expect(data.data[0]).to.be.an("object");
        //             expect(data.data[0]).to.have.property("_id");
        //             expect(data.data[0]).to.have.property("username");
        //             expect(data.data[0]).to.have.property("email");
        //             expect(data.data[0]).to.have.property("fullname");
        //             expect(data.data[0]).to.have.property("role");
        //             expect(data.data[0].role).to.be.an("object");
        //             expect(data.data[0].role).to.have.property("_id");
        //             expect(data.data[0].role).to.have.property("name");
        //             done();
        //         });
        // });
    });
});
