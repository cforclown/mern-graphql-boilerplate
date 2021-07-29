/* eslint-disable class-methods-use-this */
const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../error/api-error");
const ErrorDump = require("../error/error-dump");
const dro = require("../dro");
const hash = require("../helper").Hash;

class AuthService {
    constructor({ authDao, accessTokenExpIn, refreshTokenExpIn }) {
        this.authDao = authDao;
        this.accessTokenExpIn = accessTokenExpIn;
        this.refreshTokenExpIn = refreshTokenExpIn;
        this.removeTokenTasks = [];

        this.register = this.register.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.getUser = this.getUser.bind(this);
        this.login = this.login.bind(this);
        this.verify = this.verify.bind(this);
        this.refresh = this.refresh.bind(this);
        this.logout = this.logout.bind(this);

        this.createPayload = this.createPayload.bind(this);
        this.createToken = this.createToken.bind(this);

        this.startRemoveTokenTask = this.startRemoveTokenTask.bind(this);
        this.stopRemoveTokenTask = this.stopRemoveTokenTask.bind(this);
    }

    async register({ username, email, fullname, password, confirmPassword }) {
        try {
            if (password !== confirmPassword) {
                throw ApiError.badRequest("Confirmation password not match");
            }
            const [isUsernameAvailable, normalRole] = await Promise.all([this.authDao.isUsernameAvailable(username), this.authDao.getDefaultNormalRole()]);
            if (!isUsernameAvailable) {
                throw ApiError.badRequest("Username is taken");
            }
            if (!normalRole) {
                throw ApiError.internal("Normal role not found");
            }

            const hashedPassword = await hash(password);
            const user = await this.authDao.register({
                username,
                hashedPassword,
                email,
                fullname,
                role: normalRole._id,
            });
            if (!user) {
                throw ApiError.internal("Failed to create user data");
            }
            const payload = this.createPayload(user);
            const accessToken = jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
                expiresIn: `${this.accessTokenExpIn}s`,
            });
            const refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
                expiresIn: `${this.refreshTokenExpIn}s`,
            });

            await this.authDao.addToken(payload.userId, refreshToken);
            this.startRemoveTokenTask(refreshToken);

            return this.createToken(payload, accessToken, refreshToken);
        } catch (err) {
            throw err;
        }
    }
    async authenticate({ username, password }) {
        try {
            const hashedPassword = await hash(password);
            const user = await this.authDao.authenticate(username, hashedPassword);
            return user;
        } catch (err) {
            throw err;
        }
    }
    async getUser(userId) {
        try {
            const user = await this.authDao.getUser(userId);
            return user;
        } catch (err) {
            throw err;
        }
    }
    async login({ username, password }) {
        try {
            const hashedPassword = await hash(password);
            const user = await this.authDao.authenticate(username, hashedPassword);
            if (!user) {
                throw ApiError.notFound("User not found");
            }

            const signData = this.createPayload(user);
            const accessToken = jwt.sign(signData, config.ACCESS_TOKEN_SECRET, {
                expiresIn: `${this.accessTokenExpIn}s`,
            });
            const refreshToken = jwt.sign(signData, config.REFRESH_TOKEN_SECRET, {
                expiresIn: `${this.refreshTokenExpIn}s`,
            });

            await this.authDao.addToken(signData.userId, refreshToken);
            this.startRemoveTokenTask(refreshToken);

            return this.createToken(signData, accessToken, refreshToken);
        } catch (err) {
            throw err;
        }
    }
    async verify(user) {
        // REDIRECTED FROM /auth/login
        try {
            if (!user) {
                throw ApiError.internal("Login failed. User data not found");
            }

            const signData = this.createPayload(user);
            const accessToken = jwt.sign(signData, config.ACCESS_TOKEN_SECRET, {
                expiresIn: `${this.accessTokenExpIn}s`,
            });
            const refreshToken = jwt.sign(signData, config.REFRESH_TOKEN_SECRET, {
                expiresIn: `${this.refreshTokenExpIn}s`,
            });

            await this.authDao.addToken(signData.userId, refreshToken);
            this.startRemoveTokenTask(refreshToken);

            return this.createToken(signData, accessToken, refreshToken);
        } catch (err) {
            throw err;
        }
    }
    async refresh(refreshToken) {
        try {
            if (!(await this.authDao.isExists(refreshToken))) {
                throw ApiError.internal("Refreshing token failed. Refresh token payload not found");
            }

            const payload = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
            if (!payload) {
                throw ApiError.notFound("Refresh token is expired");
            }
            if (payload.exp) delete payload.exp;
            if (payload.iat) delete payload.iat;

            const accessToken = jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
                expiresIn: `${this.accessTokenExpIn}s`,
            });
            const newRefreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
                expiresIn: `${this.refreshTokenExpIn}s`,
            });

            this.stopRemoveTokenTask(refreshToken);

            await this.authDao.addToken(payload.userId, newRefreshToken);
            this.startRemoveTokenTask(newRefreshToken);

            return this.createToken(payload, accessToken, newRefreshToken);
        } catch (err) {
            throw err;
        }
    }
    async logout(accessToken) {
        try {
            const user = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET);
            return true;
        } catch (err) {
            throw err;
        }
    }

    createPayload(user) {
        return {
            userId: user._id,
            username: user.username,
            fullname: user.fullname,
            avatar: user.avatar,
            role: user.role,
        };
    }
    createToken(_signData, _accessToken, _refreshToken) {
        return {
            userData: {
                userId: _signData.userId,
                username: _signData.username,
                fullname: _signData.fullname,
                avatar: _signData.avatar,
                role: {
                    _id: _signData.role._id,
                    name: _signData.role.name,
                },
            },
            accessToken: _accessToken,
            refreshToken: _refreshToken,
        };
    }

    startRemoveTokenTask(refreshToken) {
        const task = {
            refreshToken: refreshToken,
            task: setTimeout(async () => {
                try {
                    await this.authDao.deleteToken(refreshToken);
                    this.stopRemoveTokenTask(refreshToken);
                } catch (error) {
                    ErrorDump(error, false);
                }
            }, this.refreshTokenExpIn * 1000),
        };
        this.removeTokenTasks.push(task);
    }
    stopRemoveTokenTask(refreshToken) {
        try {
            const task = this.removeTokenTasks.find((t) => t.refreshToken === refreshToken);
            if (!task) return;

            clearTimeout(task.task);
            this.removeTokenTasks = this.removeTokenTasks.filter((t) => t.refreshToken !== refreshToken);
        } catch (error) {
            ErrorDump(error, false);
            this.removeTokenTasks = this.removeTokenTasks.filter((t) => t.refreshToken !== refreshToken);
        }
    }
}

const authDao = require("../dao/auth");
module.exports = new AuthService({
    authDao,
    accessTokenExpIn: parseInt(config.ACCESS_TOKEN_EXP_IN),
    refreshTokenExpIn: parseInt(config.ACCESS_TOKEN_EXP_IN) * 2,
});
