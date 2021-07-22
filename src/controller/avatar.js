/* eslint-disable class-methods-use-this */

const ErrorDump = require("../error/error-dump");
const dro = require("../dro");

class AvatarController {
    constructor({ avatarService }) {
        this.avatarService = avatarService;

        this.get = this.get.bind(this);
    }

    async get(req, res) {
        try {
            const avatar = await this.avatarService.get(req.params.avatarId);
            if (!avatar || !avatar.file) {
                return res.sendStatus(404);
            }

            const imageBase64 = avatar.file.split(";base64,")[1];
            const imageBuffer = new Buffer(imageBase64, "base64");
            res.send(imageBuffer);
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }
    async update(req, res) {
        try {
            const avatarId = await this.avatarService.update(req.body);
            if (!avatarId) {
                return res.sendStatus(404);
            }
            res.send(dro.response(avatarId));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }
}

const avatarService = require("../service/avatar");
module.exports = new AvatarController({ avatarService });
