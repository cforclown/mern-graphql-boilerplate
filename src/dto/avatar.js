const joi = require("joi");

module.exports = joi.object({
    _id: joi.string().allow(null).default(null),
    filename: joi.string().required(),
    file: joi.string().required(),
});
