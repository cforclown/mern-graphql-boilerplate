const joi = require("joi");

module.exports = {
    register: joi.object({
        username: joi.string().required(),
        email: joi.string().email().required(),
        fullname: joi.string().required(),
        password: joi
            .string()
            .min(6)
            .max(32)
            .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/)
            .required()
            .messages({
                "string.min": "Password minimum 6 characters",
                "string.max": "Password maximum 32 characters",
                "string.pattern.base": "Password minimum 6 characters, maximum 32 character, at least one letter and one number",
            }),
        confirmPassword: joi
            .string()
            .min(6)
            .max(32)
            .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/)
            .required()
            .messages({
                "string.min": "Confirmation password minimum 6 characters",
                "string.max": "Confirmation password maximum 32 characters",
                "string.pattern.base": "Confirmation password minimum 6 characters, maximum 32 character, at least one letter and one number",
            }),
    }),
    login: joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
    }),
    refreshToken: joi.object({
        refreshToken: joi.string().required(),
    }),
};
