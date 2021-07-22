/* eslint-disable class-methods-use-this */
const jwt = require("jsonwebtoken");
const config = require("../config");
const ErrorDump = require("../error/error-dump");
const dro = require("../dro");

const accessTokenExpIn = parseInt(config.ACCESS_TOKEN_EXP_IN);
const refreshTokenExpIn = parseInt(config.ACCESS_TOKEN_EXP_IN) * 2;
// const accessTokenExpIn=10;
// const refreshTokenExpIn=20;

class AuthController {
    constructor({ authService }) {
        this.authService = authService;

        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.verify = this.verify.bind(this);
        this.error = this.error.bind(this);
        this.refresh = this.refresh.bind(this);
        this.logout = this.logout.bind(this);
    }

    async register(req, res) {
        try {
            const token = await this.authService.register(req.body);
            if (!token) {
                return res.status(500).send(dro.errorResponse("Register failed. Internal server error"));
            }
            res.send(dro.response(token));
        } catch (err) {
            ErrorDump(err);
            res.status(500).send(dro.errorResponse(err.message));
        }
    }
    async login(req, res) {
        try {
            const token = await this.authService.login(req.body);
            if (!token) {
                return res.status(500).send(dro.errorResponse("Login failed. Internal server error"));
            }
            res.send(dro.response(token));
        } catch (err) {
            ErrorDump(err);
            res.status(500).send(dro.errorResponse(err.message));
        }
    }
    async verify(req, res) {
        try {
            if (!req.user) {
                return res.status(500).send(dro.errorResponse("Login failed. An error occurred while verifying the user"));
            }
            const token = await this.authService.verify(req.user);
            if (!token) {
                return res.status(500).send(dro.errorResponse("Login failed. An error occurred while verifying the user"));
            }
            res.send(dro.response(token));
        } catch (err) {
            ErrorDump(err);
            res.status(500).send(dro.errorResponse(err.message));
        }
    }
    async error(req, res) {
        // LOGIN FAILED
        res.status(404).send(dro.errorResponse("Login failed. User not found"));
    }
    async refresh(req, res) {
        try {
            const token = await this.authService.refresh(req.body.refreshToken);
            if (!token) {
                return res.status(500).send(dro.errorResponse("Internal server error"));
            }
            res.send(dro.response(token));
        } catch (err) {
            ErrorDump(err);
            res.status(500).send(dro.errorResponse(err.message));
        }
    }

    async logout(req, res) {
        try {
            if (req.headers["authorization"] === undefined) {
                return res.sendStatus(401);
            }

            const accessToken = req.headers["authorization"].split(" ")[1];
            const result = await this.authService.logout(accessToken);
            res.send(dro.response(result));
        } catch (err) {
            ErrorDump(err);
            res.status(500).send(dro.errorResponse(err.message));
        }
    }
}

const authService = require("../service/auth");
module.exports = new AuthController({ authService });
