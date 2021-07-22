const mongoose = require("mongoose");

const userModel = mongoose.model("User");
const roleModel = mongoose.model("Role");
const tokenModel = mongoose.model("Token");

class AuthDao {
    constructor() {
        this.register = this.register.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.getUser = this.getUser.bind(this);

        this.isUsernameAvailable = this.isUsernameAvailable.bind(this);
        this.getDefaultNormalRole = this.getDefaultNormalRole.bind(this);

        this.addToken = this.addToken.bind(this);
        this.isExists = this.isExists.bind(this);
        this.getTokenData = this.getTokenData.bind(this);
        this.updateToken = this.updateToken.bind(this);
        this.deleteTokenByUserId = this.deleteTokenByUserId.bind(this);
        this.deleteToken = this.deleteToken.bind(this);
    }

    async register({ username, hashedPassword, email, fullname, role }) {
        let userDoc = new userModel({
            username,
            password: hashedPassword,
            email,
            fullname,
            role,
        });
        await userDoc.save();
        userDoc = await userModel.populate(userDoc, { path: "role", select: "name" });
        return userDoc;
    }
    getUser(userId) {
        return userModel.findById(userId).select("-password").populate("role").exec();
    }
    authenticate(username, hashedPass) {
        return userModel
            .findOne({
                username: username,
                password: hashedPass,
            })
            .select("-password")
            .populate("role")
            .exec();
    }

    async isUsernameAvailable(username, excludeUserId = null) {
        const user = excludeUserId ? await userModel.findOne({ _id: { $ne: excludeUserId }, username: username }) : await userModel.findOne({ username: username });
        return user ? false : true;
    }
    getDefaultNormalRole() {
        return roleModel.findOne({ isDefaultNormal: true }).exec();
    }

    async addToken(userId, refreshToken) {
        await this.deleteTokenByUserId(userId);

        const token = new tokenModel({
            userId: userId,
            refreshToken: refreshToken,
        });
        await token.save();

        return {
            userId,
            refreshToken,
        };
    }
    async isExists(refreshToken) {
        const token = await tokenModel.findOne({ refreshToken: refreshToken }).exec();
        return token != null;
    }
    async getTokenData(refreshToken) {
        const token = await tokenModel.findOne({ refreshToken: refreshToken }).exec();
        return {
            userId: token.userId,
            refreshToken: token.refreshToken,
        };
    }
    async updateToken(refreshToken, userId, newRefreshToken) {
        const token = await tokenModel.findOne({ refreshToken: refreshToken }).exec();
        token.refreshToken = newRefreshToken;
        await token.save();
        return {
            userId,
            refreshToken: newRefreshToken,
        };
    }
    deleteTokenByUserId(userId) {
        return tokenModel.deleteMany({ userId: userId }).exec();
    }
    deleteToken(refreshToken) {
        return tokenModel.findOneAndDelete({ refreshToken: refreshToken });
    }
}

module.exports = new AuthDao();
