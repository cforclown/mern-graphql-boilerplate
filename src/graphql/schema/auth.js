const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLInt, GraphQLBoolean } = require("graphql");
const authDto = require("../../dto/auth");
const authServer = require("../../service/auth");

const AuthType = new GraphQLObjectType({
    name: "AuthType",
    description: "Auth type",
    fields: () => ({
        userData: {
            type: new GraphQLObjectType({
                name: "userData",
                fields: () => ({
                    userId: { type: new GraphQLNonNull(GraphQLString) },
                    username: { type: new GraphQLNonNull(GraphQLString) },
                    fullname: { type: new GraphQLNonNull(GraphQLString) },
                    avatar: { type: GraphQLString },
                    role: {
                        type: new GraphQLObjectType({
                            name: "userDataRole",
                            fields: () => ({
                                name: { type: new GraphQLNonNull(GraphQLString) },
                            }),
                        }),
                    },
                }),
            }),
        },
        accessToken: { type: new GraphQLNonNull(GraphQLString) },
        refreshToken: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

const query = {
    login: {
        type: AuthType,
        description: "Login",
        args: {
            username: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parentValues, args, context) => {
            const { error, value } = authDto.login.validate(args);
            if (error) {
                throw Error("Username or password invalid");
            }
            return await authServer.login(value);
        },
    },
    logout: {
        type: GraphQLBoolean,
        description: "Logout",
        args: {
            accessToken: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parentValues, args, context) => {
            return await authServer.logout(args.accessToken);
        },
    },
};

module.exports = {
    query,
    // mutation,
};
