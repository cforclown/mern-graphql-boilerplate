const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
});

exports.Schema = tokenSchema;
exports.Model = mongoose.model("Token", tokenSchema, "token");
