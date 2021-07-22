/* eslint-disable class-methods-use-this */

const ErrorDump = require("../error/error-dump");
const dro = require("../dro");

class UserController {
    constructor({ userService }) {
        this.userService = userService;

        this.create = this.create.bind(this);
        this.search = this.search.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getPermissions = this.getPermissions.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);

        this.getProfile = this.getProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
    }

    async create(req, res) {
        try {
            if (!req.user.role.user.create) {
                return res.sendStatus(403);
            }
            const user = await this.userService.create(req.body);
            res.send(dro.response(user));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }

    async get(req, res) {
        try {
            const user = await this.userService.get(req.params.userId);
            res.send(dro.response(user));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }
    async getAll(req, res) {
        try {
            const users = await this.userService.getAll();
            res.send(dro.response(users));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }
    async search(req, res) {
        try {
            const data = await this.userService.search(req.body);
            res.send(dro.response(data));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }
    async getPermissions(req, res) {
        try {
            const permissions = await this.userService.getUserPermissions(req.params.userId ? req.params.userId : req.user.userId);
            res.send(dro.response(permissions));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }

    async update(req, res) {
        try {
            if (!req.user.role.user.update) {
                return res.sendStatus(403);
            }

            const user = await this.userService.update(req.body);
            res.send(dro.response(user));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }

    async delete(req, res) {
        try {
            if (!req.user.role.user.delete) return res.sendStatus(403);

            const userId = await this.userService.delete(req.params.userId);
            res.send(dro.response(userId));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }

    async getProfile(req, res) {
        try {
            const profile = await this.userService.getProfile(req.params.userId);
            res.send(dro.response(profile));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }
    async updateProfile(req, res) {
        try {
            const profile = await this.userService.updateProfile(req.user.userId, req.body);
            res.send(dro.response(profile));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }
    async changeUsername(req, res) {
        try {
            const userData = await this.userService.changeUsername(req.user.userId, req.body.username);
            res.send(dro.response(userData));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }
}

const userService = require("../service/user");
module.exports = new UserController({ userService });
