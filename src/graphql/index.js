const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } = require("graphql");
const authSchema = require("./schema/auth");
const userSchema = require("./schema/user");
const roleSchema = require("./schema/role");

const rootQuery = new GraphQLObjectType({
    name: "query",
    description: "Root query",
    fields: () => ({
        ...authSchema.query,
        ...userSchema.query,
        ...roleSchema.query,
    }),
});

const rootMutation = new GraphQLObjectType({
    name: "mutation",
    fields: {
        ...userSchema.mutation,
        ...roleSchema.mutation,
    },
});

module.exports = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation,
});
