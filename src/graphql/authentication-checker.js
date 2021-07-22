const jwt = require("jsonwebtoken");
const config = require("../config");
const argsValidator = require("./args-validator");

async function AuthenticationCheck(context) {
    if (!context || !context.headers || !context.headers.authorization) {
        throw Error("Access token not found");
    }
    const authorization = context.headers.authorization;
    if (authorization.split(" ")[0] !== "Bearer") {
        throw Error("Authorization is not bearer");
    }
    const accessToken = authorization.split(" ")[1];

    const user = await jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET);
    if (!user) {
        throw Error("Invalid access token");
    }
    context.user = user;
}

module.exports = AuthenticationCheck;
