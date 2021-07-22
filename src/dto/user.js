const joi = require("joi");

module.exports = {
    search: joi.object({
        query: joi.string().allow(null).allow("").default(null),
        pagination: joi
            .object({
                page: joi.number().min(1).required(),
                limit: joi.number().min(1).required(),
                sort: joi
                    .object({
                        by: joi.string().valid("USERNAME", "FULLNAME", "ROLE").allow(null).default("USERNAME"),
                        order: joi.string().valid("ASC", "DESC").allow(null).default("ASC"),
                    })
                    .allow(null)
                    .default({
                        by: "USERNAME",
                        order: "ASC",
                    }),
            })
            .allow(null)
            .default({
                page: 1,
                limit: 10,
                sort: {
                    by: "USERNAME",
                    order: "ASC",
                },
            }),
    }),
    create: joi.object({
        username: joi.string().required(),
        email: joi.string().email().required(),
        fullname: joi.string().min(1).required(),
        role: joi.string().required(),
    }),
    update: joi.object({
        _id: joi.string().required(),
        role: joi.string().required(),
    }),
    delete: joi.object({
        userId: joi.string().required(),
    }),
    updateProfile: joi.object({
        email: joi.string().allow(null).default(null),
        fullname: joi.string().allow(null).default(null),
    }),
    changeAvatar: joi.object({
        filename: joi.string().required(),
        file: joi.string().required(),
    }),
    changeUsername: joi.object({
        username: joi.string().required(),
    }),
};
