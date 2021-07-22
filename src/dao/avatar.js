const mongoose = require("mongoose");

class AvatarDao {
    constructor() {
        this.create = this.create.bind(this);
        this.get = this.get.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create({ file, filename }) {
        const prefix = file.split(";base64,").length > 0 ? file.split(";base64,")[0] : null;
        const ext = file.match(/[^:/]\w+(?=;|,)/);
        const avatarDoc = new mongoose.model("Avatar")({
            filename,
            file,
            prefix,
            ext: ext && ext.length > 0 ? ext[0] : null,
        });
        await avatarDoc.save();

        return avatarDoc._id.toString();
    }
    get(avatarId) {
        return mongoose.model("Avatar").findById(avatarId).exec();
    }
    async update({ _id, file, filename }) {
        const prefix = file.split(";base64,").length > 0 ? file.split(";base64,")[0] : null;
        const ext = file.match(/[^:/]\w+(?=;|,)/);
        const result = await mongoose
            .model("Avatar")
            .updateOne({ _id: _id }, { $set: { filename, file, ext, prefix } });
        if (result.n === 0) {
            return null;
        }

        return _id;
    }
    async delete(avatarId) {
        const res = await mongoose.model("Avatar").deleteOne({ _id: avatarId }).exec();
        if (res.n === 0) {
            return null;
        }

        return avatarId;
    }
}

module.exports = new AvatarDao();
