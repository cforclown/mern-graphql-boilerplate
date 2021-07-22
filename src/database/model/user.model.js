const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        avatar: {
            type: mongoose.Types.ObjectId,
            required: false,
            default: null,
        },
        role: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "Role",
        },
    },
    { timestamps: true }
);

const userModel = mongoose.model("User", userSchema, "user");

module.exports = {
    Schema: userSchema,
    Model: userModel,
};
