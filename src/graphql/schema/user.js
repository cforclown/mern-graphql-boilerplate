const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLInputObjectType } = require("graphql");
const userDto = require("../../dto/user");
const userService = require("../../service/user");
const AuthenticationCheck = require("../authentication-checker");
const AuthorizationCheck = require("../authorization-checker");
const ArgsValidator = require("../args-validator");

const UserType = new GraphQLObjectType({
    name: "UserType",
    description: "User type",
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLString },
        fullname: { type: GraphQLString },
        avatar: { type: GraphQLString },
        role: {
            type: new GraphQLObjectType({
                name: "role",
                fields: {
                    _id: { type: new GraphQLNonNull(GraphQLString) },
                    name: { type: new GraphQLNonNull(GraphQLString) },
                },
            }),
        },
    }),
});
const UpdateUserType = new GraphQLObjectType({
    name: "UpdateUserType",
    description: "Update user type",
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLString },
        fullname: { type: GraphQLString },
        avatar: { type: GraphQLString },
        role: { type: new GraphQLNonNull(GraphQLString) },
    }),
});
const CreateUserType = new GraphQLObjectType({
    name: "CreateUserType",
    description: "Create user type",
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLString },
        fullname: { type: GraphQLString },
        avatar: { type: GraphQLString },
        role: { type: new GraphQLNonNull(GraphQLString) },
    }),
});
const SearchUserType = new GraphQLObjectType({
    name: "SearchUserType",
    description: "Search user type",
    fields: () => ({
        pagination: {
            type: new GraphQLObjectType({
                name: "searchUserpagination",
                description: "Pagination result",
                fields: () => ({
                    page: { type: new GraphQLNonNull(GraphQLInt) },
                    limit: { type: new GraphQLNonNull(GraphQLInt) },
                    pageCount: { type: new GraphQLNonNull(GraphQLInt) },
                    sort: {
                        type: new GraphQLObjectType({
                            name: "searchUserpaginationSort",
                            fields: () => ({
                                by: { type: new GraphQLNonNull(GraphQLInt) },
                                order: { type: new GraphQLNonNull(GraphQLInt) },
                            }),
                        }),
                    },
                }),
            }),
        },
        data: { type: new GraphQLList(UserType) },
    }),
});
const UserPermissionsType = new GraphQLObjectType({
    name: "UserPermissionsType",
    description: "User type",
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        user: {
            type: new GraphQLObjectType({
                name: "user",
                fields: {
                    view: { type: GraphQLBoolean },
                    create: { type: GraphQLBoolean },
                    update: { type: GraphQLBoolean },
                    delete: { type: GraphQLBoolean },
                },
            }),
        },
        masterData: {
            type: new GraphQLObjectType({
                name: "masterData",
                fields: {
                    view: { type: GraphQLBoolean },
                    create: { type: GraphQLBoolean },
                    update: { type: GraphQLBoolean },
                    delete: { type: GraphQLBoolean },
                },
            }),
        },
    }),
});

const query = {
    users: {
        type: new GraphQLList(UserType),
        description: "Get all user",
        resolve: async (parent, args, context) => {
            await AuthenticationCheck(context);
            if (!AuthorizationCheck(context.user, "user", "view")) {
                throw Error("Forbidden");
            }
            return await userService.getAll();
        },
    },
    user: {
        type: UserType,
        description: "Get user by id",
        args: {
            userId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, args, context) => {
            await AuthenticationCheck(context);
            return await userService.get(args.userId);
        },
    },
    searchUsers: {
        type: SearchUserType,
        description: "Search users with pagination",
        args: {
            query: { type: GraphQLString },
            pagination: {
                type: new GraphQLInputObjectType({
                    name: "searchUserPaginationParam",
                    fields: () => ({
                        page: { type: GraphQLInt },
                        limit: { type: GraphQLInt },
                        sort: {
                            type: new GraphQLInputObjectType({
                                name: "searchUserPaginationSortParam",
                                fields: () => ({
                                    by: { type: GraphQLString },
                                    order: { type: GraphQLString },
                                }),
                            }),
                        },
                    }),
                }),
            },
        },
        resolve: async (parent, args, context) => {
            await AuthenticationCheck(context);
            if (!AuthorizationCheck(context.user, "user", "view")) {
                throw Error("Forbidden");
            }
            const validArgs = ArgsValidator(userDto.search, args);

            return await userService.search(validArgs);
        },
    },
    getUserPermissions: {
        type: UserPermissionsType,
        description: "Get user permissions",
        args: {
            userId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, args, context) => {
            await AuthenticationCheck(context);
            return await userService.getUserPermissions(args.userId);
        },
    },
    getUserProfile: {
        type: UserType,
        description: "Get user profile",
        args: {
            userId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, args, context) => {
            await AuthenticationCheck(context);
            return await userService.getProfile(context.user.userId);
        },
    },
};

const mutation = {
    createUser: {
        type: CreateUserType,
        description: "Create user",
        args: {
            username: { type: new GraphQLNonNull(GraphQLString) },
            email: { type: new GraphQLNonNull(GraphQLString) },
            fullname: { type: new GraphQLNonNull(GraphQLString) },
            role: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, args, context) => {
            await AuthenticationCheck(context);
            if (!AuthorizationCheck(context.user, "user", "create")) {
                throw Error("Forbidden");
            }
            const validArgs = ArgsValidator(userDto.create, args);

            return await userService.create(validArgs);
        },
    },
    updateUser: {
        type: UpdateUserType,
        description: "Update user",
        args: {
            _id: { type: new GraphQLNonNull(GraphQLString) },
            role: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, args, context) => {
            await AuthenticationCheck(context);
            if (!AuthorizationCheck(context.user, "user", "update")) {
                throw Error("Forbidden");
            }
            const validArgs = ArgsValidator(userDto.update, args);

            return await userService.update(validArgs);
        },
    },
    deleteUser: {
        type: new GraphQLNonNull(GraphQLString),
        description: "Delete user",
        args: {
            userId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, args, context) => {
            await AuthenticationCheck(context);
            if (!AuthorizationCheck(context.user, "user", "delete")) {
                throw Error("Forbidden");
            }
            const validArgs = ArgsValidator(userDto.delete, args);

            return await userService.delete(validArgs.userId);
        },
    },

    updateProfile: {
        type: UserType,
        description: "Update user profile",
        args: {
            email: { type: new GraphQLNonNull(GraphQLString) },
            fullname: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, args, context) => {
            await AuthenticationCheck(context);
            const validArgs = ArgsValidator(userDto.updateProfile, args);

            return await userService.updateProfile(context.user.userId, validArgs);
        },
    },
    changeUsername: {
        type: UserType,
        description: "Change username",
        args: {
            username: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, args, context) => {
            await AuthenticationCheck(context);
            const validArgs = ArgsValidator(userDto.changeUsername, args);

            return await userService.changeUsername(context.user.userId, validArgs.username);
        },
    },
};

module.exports = {
    query,
    mutation,
};
