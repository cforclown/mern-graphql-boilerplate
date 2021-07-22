const joi = require("joi");

module.exports = {
    search: joi.object({
        query: joi.string().required(),
        pagination: joi
            .object({
                page: joi.number().min(1).required(),
                limit: joi.number().min(1).required(),
                sort: joi
                    .object({
                        by: joi.string().valid("NAME").allow(null).default("NAME"),
                        order: joi.string().valid("ASC", "DESC").allow(null).default("ASC"),
                    })
                    .allow(null)
                    .default({
                        by: "NAME",
                        order: "ASC",
                    }),
            })
            .allow(null)
            .default({
                page: 1,
                limit: 10,
                sort: {
                    by: "NAME",
                    order: "ASC",
                },
            }),
    }),
    get: joi.object({
        roleId: joi.string().required(),
    }),
    create: joi.object({
        name: joi.string().required(),
        user: joi
            .object({
                view: joi.bool().allow(null).default(true),
                create: joi.bool().allow(null).default(false),
                update: joi.bool().allow(null).default(false),
                delete: joi.bool().allow(null).default(false),
            })
            .allow(null)
            .default({
                view: true,
                create: false,
                update: false,
                delete: false,
            }),
        masterData: joi
            .object({
                view: joi.bool().allow(null).default(false),
                create: joi.bool().allow(null).default(false),
                update: joi.bool().allow(null).default(false),
                delete: joi.bool().allow(null).default(false),
            })
            .allow(null)
            .default({
                view: false,
                create: false,
                update: false,
                delete: false,
            }),
        desc: joi.string().allow(null).default(null),
    }),
    update: joi.object({
        _id: joi.string().allow(null).default(null),
        name: joi.string().required(),
        user: joi
            .object({
                view: joi.bool(),
                create: joi.bool(),
                update: joi.bool(),
                delete: joi.bool(),
            })
            .required(),
        masterData: joi
            .object({
                view: joi.bool(),
                create: joi.bool(),
                update: joi.bool(),
                delete: joi.bool(),
            })
            .required(),
        desc: joi.string().allow(null).default(null),
    }),
    delete: joi.object({
        roleId: joi.string().required(),
    }),
};
