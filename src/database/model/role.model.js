const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: {
            view: {
                type: Boolean,
                required: true,
                default: true,
            },
            create: {
                type: Boolean,
                required: true,
                default: false,
            },
            update: {
                type: Boolean,
                required: true,
                default: false,
            },
            delete: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
        required: false,
        default: {
            view: true,
            create: false,
            update: false,
            delete: false,
        },
    },
    masterData: {
        type: {
            view: {
                type: Boolean,
                required: true,
                default: false,
            },
            create: {
                type: Boolean,
                required: true,
                default: false,
            },
            update: {
                type: Boolean,
                required: true,
                default: false,
            },
            delete: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
        required: false,
        default: {
            view: true,
            create: false,
            update: false,
            delete: false,
        },
    },
    desc: {
        type: String,
        required: false,
        default: "",
    },
    isDefaultNormal: {
        type: Boolean,
        required: false,
        default: false,
    },
    editable: {
        type: Boolean,
        required: false,
        default: true,
    },
    isArchived: {
        type: Boolean,
        required: false,
        default: false,
    },
});

exports.Schema = roleSchema;
exports.Model = mongoose.model("Role", roleSchema, "role");
