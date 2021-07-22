function ArgsValidator(schema, args) {
    const { error, value } = schema.validate(args);
    if (error) {
        throw Error(error.message);
    }

    return value;
}

module.exports = ArgsValidator;
