process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = require("chai").expect;
const request = require("supertest");
const Server = require("../src/server");
const mockData = require("../test-mock-data");

describe("TESTING /api/avatar", () => {
    const server = new Server();

    before((done) => {
        server
            .startForTest()
            .then(() => {
                done();
            })
            .catch((err) => done("An error occurred when starting the server"));
    });

    describe("[GET]", () => {
        it("GET AVATAR", (done) => {
            request(server.app.app)
                .get("/api/avatar/" + mockData.users[0].avatar)
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    done();
                });
        });
    });
});
