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
function searchUsersRequestBody(query, paginationPage, paginationLimit, sortBy, sortOrder) {
    // return {
    //     query: `query {
    //         searchUsers(query:"a", pagination:{
    //             page:1,
    //             limit:5,
    //             sort:{
    //                 by:"USERNAME",
    //                 order:"ASC"
    //             }
    //         }) {
    //             pagination {
    //                 page
    //                 limit
    //                 pageCount
    //             }
    //             data {
    //                 _id
    //                 email
    //                 fullname
    //                 avatar
    //                 role {
    //                     _id
    //                     name
    //                 }
    //             }
    //         }
    //     }`,
    // };
    return {
        query: `query {
            searchUsers(query:"${query}", pagination: {
                page: ${paginationPage},
                limit: ${paginationLimit},
                sort: {
                    by: "${sortBy}",
                    order: "${sortOrder}"
                }
            }) {
                pagination {
                    page
                    limit
                    pageCount
                }
                data {
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
            }
        }`,
    };
}

describe("TESTING /api/user", () => {
    const server = new Server();
    let adminUserToken = null;
    let normalUserToken = null;

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
        it("CREATE USER", async () => {
            try {
                // CREATE NEW USER
                const createUserResponse = await request(server.app.app)
                    .post("/graphql")
                    .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                    .send(createUserRequestBody("username", "email@gmail.com", "fullname", mockData.roles[0]._id));
                expect(createUserResponse.status).to.equal(200);
                expect(createUserResponse).to.contain.property("text");

                const createUserResponseBody = JSON.parse(createUserResponse.text);
                expect(createUserResponseBody).to.be.an("object");
                expect(createUserResponseBody).to.contain.property("data");
                expect(createUserResponseBody.data).to.be.an("object");
                expect(createUserResponseBody.data).to.contain.property("createUser");
                expect(createUserResponseBody.data.createUser).to.be.an("object");
                expect(createUserResponseBody.data.createUser).to.contain.property("_id");
                expect(createUserResponseBody.data.createUser).to.contain.property("username");
                expect(createUserResponseBody.data.createUser).to.contain.property("email");
                expect(createUserResponseBody.data.createUser).to.contain.property("fullname");
                expect(createUserResponseBody.data.createUser).to.contain.property("avatar");
                expect(createUserResponseBody.data.createUser).to.contain.property("role");

                const createdUser = createUserResponseBody.data.createUser;

                // GET USER BY CREATED USER ID
                const getUserResponse = await request(server.app.app)
                    .post("/graphql")
                    .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                    .send(getUserRequestBody(createdUser._id));
                expect(getUserResponse.status).to.equal(200);
                expect(getUserResponse).to.contain.property("text");

                const getUserResponseBody = JSON.parse(getUserResponse.text);
                expect(getUserResponseBody).to.be.an("object");
                expect(getUserResponseBody).to.contain.property("data");
                expect(getUserResponseBody.data).to.be.an("object");
                expect(getUserResponseBody.data).to.contain.property("user");
                expect(getUserResponseBody.data.user).to.be.an("object");
                expect(getUserResponseBody.data.user).to.contain.property("_id");
                expect(getUserResponseBody.data.user).to.contain.property("username");
                expect(getUserResponseBody.data.user).to.contain.property("email");
                expect(getUserResponseBody.data.user).to.contain.property("fullname");
                expect(getUserResponseBody.data.user).to.contain.property("avatar");
                expect(getUserResponseBody.data.user).to.contain.property("role");
            } catch (err) {
                throw err;
            }
        });
        it("UPDATE USER", async () => {
            try {
                // CREATE NEW USER
                const createUserResponse = await request(server.app.app)
                    .post("/graphql")
                    .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                    .send(createUserRequestBody("update", "update@gmail.com", "update", mockData.roles[0]._id));
                expect(createUserResponse.status).to.equal(200);
                expect(createUserResponse).to.contain.property("text");

                const createUserResponseBody = JSON.parse(createUserResponse.text);
                expect(createUserResponseBody).to.be.an("object");
                expect(createUserResponseBody).to.contain.property("data");
                expect(createUserResponseBody.data).to.be.an("object");
                expect(createUserResponseBody.data).to.contain.property("createUser");
                expect(createUserResponseBody.data.createUser).to.be.an("object");
                expect(createUserResponseBody.data.createUser).to.contain.property("_id");
                expect(createUserResponseBody.data.createUser).to.contain.property("username");
                expect(createUserResponseBody.data.createUser).to.contain.property("email");
                expect(createUserResponseBody.data.createUser).to.contain.property("fullname");
                expect(createUserResponseBody.data.createUser).to.contain.property("avatar");
                expect(createUserResponseBody.data.createUser).to.contain.property("role");

                const createdUser = createUserResponseBody.data.createUser;

                // UPDATE CREATED USER
                const updateUserResponse = await request(server.app.app)
                    .post("/graphql")
                    .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                    .send(updateUserRequestBody(createdUser._id, mockData.roles[1]._id));
                expect(updateUserResponse.status).to.equal(200);
                expect(updateUserResponse).to.contain.property("text");

                const updateUserResponseBody = JSON.parse(updateUserResponse.text);
                expect(updateUserResponseBody).to.be.an("object");
                expect(updateUserResponseBody).to.contain.property("data");
                expect(updateUserResponseBody.data).to.be.an("object");
                expect(updateUserResponseBody.data).to.contain.property("updateUser");
                expect(updateUserResponseBody.data.updateUser).to.be.an("object");
                expect(updateUserResponseBody.data.updateUser).to.contain.property("_id");
                expect(updateUserResponseBody.data.updateUser).to.contain.property("username");
                expect(updateUserResponseBody.data.updateUser).to.contain.property("email");
                expect(updateUserResponseBody.data.updateUser).to.contain.property("fullname");
                expect(updateUserResponseBody.data.updateUser).to.contain.property("avatar");
                expect(updateUserResponseBody.data.updateUser).to.contain.property("role");

                // GET UPDATED USER, check whether the data changed or not
                const getUserResponse = await request(server.app.app)
                    .post("/graphql")
                    .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                    .send(getUserRequestBody(createdUser._id));
                expect(getUserResponse.status).to.equal(200);
                expect(getUserResponse).to.contain.property("text");

                const getUserResponseBody = JSON.parse(getUserResponse.text);
                expect(getUserResponseBody).to.be.an("object");
                expect(getUserResponseBody).to.contain.property("data");
                expect(getUserResponseBody.data).to.be.an("object");
                expect(getUserResponseBody.data).to.contain.property("user");
                expect(getUserResponseBody.data.user).to.be.an("object");
                expect(getUserResponseBody.data.user).to.contain.property("_id");
                expect(getUserResponseBody.data.user).to.contain.property("username");
                expect(getUserResponseBody.data.user).to.contain.property("email");
                expect(getUserResponseBody.data.user).to.contain.property("fullname");
                expect(getUserResponseBody.data.user).to.contain.property("avatar");
                expect(getUserResponseBody.data.user).to.contain.property("role");
                expect(getUserResponseBody.data.user.role).to.be.an("object");
                expect(getUserResponseBody.data.user.role).to.contain.property("_id");
                expect(getUserResponseBody.data.user.role._id).to.equal(mockData.roles[1]._id.toString());
            } catch (err) {
                throw err;
            }
        });
        it("DELETE USER ASYNC", async () => {
            try {
                // CREATE NEW USER
                let createUserResponse = await request(server.app.app)
                    .post("/graphql")
                    .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                    .send(createUserRequestBody("delete", "delete@gmail.com", "delete", mockData.roles[0]._id));

                expect(createUserResponse.status).to.equal(200);
                expect(createUserResponse).to.contain.property("text");

                const createUserResponseBody = JSON.parse(createUserResponse.text);
                expect(createUserResponseBody).to.be.an("object");
                expect(createUserResponseBody).to.contain.property("data");
                expect(createUserResponseBody.data).to.be.an("object");
                expect(createUserResponseBody.data).to.contain.property("createUser");
                expect(createUserResponseBody.data.createUser).to.be.an("object");
                expect(createUserResponseBody.data.createUser).to.contain.property("_id");
                expect(createUserResponseBody.data.createUser).to.contain.property("username");
                expect(createUserResponseBody.data.createUser).to.contain.property("email");
                expect(createUserResponseBody.data.createUser).to.contain.property("fullname");
                expect(createUserResponseBody.data.createUser).to.contain.property("avatar");
                expect(createUserResponseBody.data.createUser).to.contain.property("role");

                const createdUser = createUserResponseBody.data.createUser;

                // DELETE CREATED USER
                const deleteResponse = await request(server.app.app)
                    .post("/graphql")
                    .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                    .send(deleteUserRequestBody(createdUser._id));

                expect(deleteResponse.status).to.equal(200);
                expect(deleteResponse).to.contain.property("text");

                const deleteUserResponseBody = JSON.parse(deleteResponse.text);
                expect(deleteUserResponseBody).to.be.an("object");
                expect(deleteUserResponseBody).to.contain.property("data");
                expect(deleteUserResponseBody.data).to.be.an("object");
                expect(deleteUserResponseBody.data).to.contain.property("deleteUser");
                expect(deleteUserResponseBody.data.deleteUser).to.be.an("string");
            } catch (err) {
                throw err;
            }
        });

        it("SEARCH USERs", async () => {
            try {
                const response = await request(server.app.app)
                    .post("/graphql")
                    .set({ Authorization: `Bearer ${adminUserToken.accessToken}` })
                    .send(searchUsersRequestBody("", 1, 10, "FULLNAME", "DESC"));
                expect(response.status).to.equal(200);
                expect(response).to.contain.property("text");

                const body = JSON.parse(response.text);
                expect(body).to.be.an("object");
                expect(body).to.contain.property("data");
                expect(body.data).to.be.an("object");
                expect(body.data).to.have.property("searchUsers");

                expect(body.data.searchUsers).to.be.an("object");
                expect(body.data.searchUsers).to.have.property("pagination");
                expect(body.data.searchUsers.pagination).to.be.an("object");
                expect(body.data.searchUsers.pagination).to.have.property("page");
                expect(body.data.searchUsers.pagination.page).to.equal(1);
                expect(body.data.searchUsers.pagination).to.have.property("limit");
                expect(body.data.searchUsers.pagination.limit).to.equal(10);
                expect(body.data.searchUsers.pagination).to.have.property("pageCount");
                expect(body.data.searchUsers.pagination.pageCount).to.greaterThan(0);
                expect(body.data.searchUsers).to.have.property("data");
                expect(body.data.searchUsers.data).to.be.an("array");
                for (const user of body.data.searchUsers.data) {
                    expect(user).to.be.an("object");
                    expect(user).to.have.property("_id");
                    expect(user).to.have.property("username");
                    expect(user).to.have.property("email");
                    expect(user).to.have.property("fullname");
                    expect(user).to.have.property("role");
                    expect(user.role).to.be.an("object");
                    expect(user.role).to.have.property("_id");
                    expect(user.role).to.have.property("name");
                }
            } catch (err) {
                throw err;
            }
        });
    });
});
