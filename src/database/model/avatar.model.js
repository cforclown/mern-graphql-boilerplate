const mongoose = require("mongoose");

const avatarSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    file: {
        type: String,
        required: true,
    },
    prefix: {
        type: String,
        required: false,
        default: null,
    },
    ext: {
        type: String,
        required: false,
        default: null,
    },
}, { timestamps: true });


exports.Schema = avatarSchema;
exports.Model = mongoose.model("Avatar", avatarSchema, "avatar");
