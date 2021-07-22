process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = require("chai").expect;
const request = require("supertest");
const Server = require("../src/server");
const ErrorDump = require("../src/error/error-dump");

describe("TESTING AUTH ROUTER", () => {
    const server = new Server();
    let registeredToken = null;

    before((done) => {
        server
            .startForTest()
            .then(() => {
                done();
            })
            .catch((err) => done("An error occurred when starting the server"));
    });

    describe("TESTING", () => {
        it("REGISTER", (done) => {
            request(server.app.app)
                .post("/auth/register")
                .send({
                    username: "register",
                    email: "register@gmail.com",
                    fullname: "register",
                    password: "register1",
                    confirmPassword: "register1",
                })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");
                    const json = JSON.parse(response.text);
                    expect(json).to.contain.property("data");

                    const token = json.data;
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

                    registeredToken = token;

                    done();
                });
        });
        it("LOGIN", (done) => {
            request(server.app.app)
                .post("/auth/login/test")
                .send({
                    username: "register",
                    password: "register1",
                })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");
                    const json = JSON.parse(response.text);
                    expect(json).to.contain.property("data");

                    const token = json.data;
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

                    registeredToken = token;

                    done();
                });
        });
        it("REFRESH", (done) => {
            request(server.app.app)
                .post("/auth/refresh")
                .send({ refreshToken: registeredToken.refreshToken })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");
                    const json = JSON.parse(response.text);
                    expect(json).to.contain.property("data");

                    const token = json.data;
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

                    registeredToken = token;

                    done();
                });
        });
        it("LOGOUT", (done) => {
            request(server.app.app)
                .delete("/auth/logout")
                .set({ Authorization: `Bearer ${registeredToken.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");
                    const json = JSON.parse(response.text);
                    expect(json).to.contain.property("data");
                    expect(json.data).to.be.an("boolean");
                    expect(json.data).to.equals(true);

                    done();
                });
        });
    });
});
