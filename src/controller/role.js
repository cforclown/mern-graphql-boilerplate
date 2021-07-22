/* eslint-disable class-methods-use-this */

const ErrorDump = require("../error/error-dump");
const dro = require("../dro");

class RoleController {
    constructor({ roleService }) {
        this.roleService = roleService;

        this.create = this.create.bind(this);
        this.search = this.search.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }
    async create(req, res) {
        try {
            if (!req.user.role.masterData.create) {
                return res.sendStatus(403);
            }

            const role = await this.roleService.create(req.body);
            res.send(dro.response(role));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }

    async get(req, res) {
        try {
            const role = await this.roleService.get(req.params.roleId);
            res.send(dro.response(role));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }
    async getAll(req, res) {
        try {
            const roles = await this.roleService.getAll();
            res.send(dro.response(roles));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }
    async search(req, res) {
        try {
            const data = await this.roleService.search(req.body);
            res.send(dro.response(data));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }

    async update(req, res) {
        try {
            if (!req.user.role.masterData.update) {
                return res.sendStatus(403);
            }

            const role = await this.roleService.update(req.body);
            res.send(dro.response(role));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }

    async delete(req, res) {
        try {
            if (!req.user.role.masterData.delete) {
                return res.sendStatus(403);
            }

            const result = await this.roleService.delete(req.params.roleId);
            res.send(dro.response(result));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }
}

const roleService = require("../service/role");
module.exports = new RoleController({ roleService });
