const mongoose = require("mongoose");
const ApiError = require("../error/api-error");
class AvatarService {
    constructor({ avatarDao }) {
        this.avatarDao = avatarDao;

        this.create = this.create.bind(this);
        this.get = this.get.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create({ filename, file }) {
        const avatarId = await this.avatarDao.create({
            filename,
            file,
        });

        return avatarId;
    }
    async get(avatarId) {
        const avatar = await this.avatarDao.get(avatarId);
        return avatar;
    }
    async update({ _id, filename, file }) {
        const avatarId = await this.avatarDao.update({ _id, filename, file });
        return avatarId;
    }
    async delete(avatarId) {
        const res = await this.avatarDao.delete(avatarId);
        return res;
    }
}

const avatarDao = require("../dao/avatar");
module.exports = new AvatarService({ avatarDao });
