const jwt = require("jsonwebtoken");
const config = require("../config");
const argsValidator = require("./args-validator");

function AuthorizationCheck(user, role, permission) {
    if (!user || !user.role) {
        throw Error("Invalid user object");
    }
    if (!user.role[role]) {
        throw Error("Role not found");
    }
    if (user.role[role][permission] === undefined || user.role[role][permission] === null) {
        throw Error("Permission not found");
    }

    return user.role[role][permission];
}

module.exports = AuthorizationCheck;
