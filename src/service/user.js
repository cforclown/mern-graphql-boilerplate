const mongoose = require("mongoose");
const ApiError = require("../error/api-error");
const hash = require("../helper").Hash;

class UserService {
    constructor({ userDao }) {
        this.userDao = userDao;

        this.create = this.create.bind(this);
        this.search = this.search.bind(this);

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getUserPermissions = this.getUserPermissions.bind(this);

        this.update = this.update.bind(this);

        this.delete = this.delete.bind(this);

        this.getProfile = this.getProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
    }

    async create({ username, email, fullname, role }) {
        if (!this.validateEmail(email)) {
            throw ApiError.badRequest("Invalid email address");
        }
        const [isUsernameAvailable, isEmailAvailable, isRoleValid] = await Promise.all([
            this.userDao.isUsernameAvailable(username),
            this.userDao.isEmailAvailable(email),
            this.userDao.isRoleValid(role),
        ]);
        if (!isUsernameAvailable) {
            throw ApiError.badRequest("Username is taken");
        }
        if (!isEmailAvailable) {
            throw ApiError.badRequest("Email already registered");
        }
        if (!isRoleValid) {
            throw ApiError.badRequest("Invalid role id");
        }

        const hashedPassword = await hash(username + "_c");
        const user = await this.userDao.create({ username, hashedPassword, email, fullname, role });

        return user;
    }

    async get(userId) {
        const user = await this.userDao.get(userId);
        if (!user) {
            throw ApiError.notFound("User not found");
        }

        return user;
    }
    async getAll() {
        const userList = await this.userDao.getAll();
        return userList;
    }
    search({ query, pagination }) {
        return this.userDao.search({ query, pagination });
    }
    async getUserPermissions(userId) {
        const permissions = await this.userDao.getUserPermissions(userId);
        if (!permissions) {
            throw ApiError.notFound("User not found");
        }
        return permissions;
    }

    async update({ _id, role }) {
        if (!(await this.userDao.isRoleValid(role))) {
            throw ApiError.badRequest("Invalid role id");
        }

        const result = await this.userDao.update({ _id, role });
        return result;
    }

    async delete(userId) {
        const deletedUserId = await this.userDao.delete(userId);
        if (!deletedUserId) {
            throw ApiError.notFound("User not found");
        }
        return deletedUserId;
    }

    //#region PROFILE STUFF
    async getProfile(userId) {
        const user = await this.userDao.get(userId);
        if (!user) {
            throw ApiError.notFound("User not found");
        }

        return user;
    }
    async updateProfile(userId, { email, fullname }) {
        if (!this.validateEmail(email)) {
            throw ApiError.badRequest("Invalid email address");
        }
        if (!(await this.userDao.isEmailAvailable(email, userId))) {
            throw ApiError.badRequest("Email already registered");
        }
        const user = await this.userDao.updateProfile(userId, { email, fullname });

        return user;
    }
    async changeUsername(userId, username) {
        const user = await this.userDao.get(userId);
        if (!user) {
            throw ApiError.notFound("User not found");
        }
        if (user.username == username) {
            return username;
        }

        if (!(await this.userDao.isUsernameAvailable(username, user._id))) {
            throw ApiError.badRequest("Username is taken");
        }
        await this.userDao.changeUsername(userId, username);

        return username;
    }

    validateEmail(email) {
        const emailre = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

        if (!email) return false;
        if (email.length > 254) return false;

        const isValid = emailre.test(email);
        if (!isValid) return false;

        // Further checking of some things regex can't handle
        const parts = email.split("@");
        if (parts[0].length > 64) return false;

        const domainParts = parts[1].split(".");
        if (domainParts.some((part) => part.length > 63)) return false;

        return true;
    }
}

const userDao = require("../dao/user");
module.exports = new UserService({ userDao });
//#endregion
