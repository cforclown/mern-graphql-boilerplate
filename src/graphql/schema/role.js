const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLInputObjectType } = require("graphql");
const roleDto = require("../../dto/role");
const roleService = require("../../service/role");
const AuthenticationCheck = require("../authentication-checker");
const AuthorizationCheck = require("../authorization-checker");
const ArgsValidator = require("../args-validator");

const RoleType = new GraphQLObjectType({
    name: "RoleType",
    description: "Role type",
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        user: {
            type: new GraphQLObjectType({
                name: "permissionUser",
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
                name: "permissionMasterData",
                fields: {
                    view: { type: GraphQLBoolean },
                    create: { type: GraphQLBoolean },
                    update: { type: GraphQLBoolean },
                    delete: { type: GraphQLBoolean },
                },
            }),
        },
        desc: { type: GraphQLString },
        editable: { type: GraphQLBoolean },
        isArchived: { type: GraphQLBoolean },
    }),
});
const SearchRoleType = new GraphQLObjectType({
    name: "SearchRoleType",
    description: "Search role type",
    fields: () => ({
        pagination: {
            type: new GraphQLObjectType({
                name: "searchRolePagination",
                description: "Pagination result",
                fields: () => ({
                    page: { type: new GraphQLNonNull(GraphQLInt) },
                    limit: { type: new GraphQLNonNull(GraphQLInt) },
                    pageCount: { type: new GraphQLNonNull(GraphQLInt) },
                    sort: {
                        type: new GraphQLObjectType({
                            name: "searchRolePaginationSort",
                            fields: () => ({
                                by: { type: new GraphQLNonNull(GraphQLInt) },
                                order: { type: new GraphQLNonNull(GraphQLInt) },
                            }),
                        }),
                    },
                }),
            }),
        },
        data: { type: new GraphQLList(RoleType) },
    }),
});

const query = {
    roles: {
        type: new GraphQLList(RoleType),
        description: "Get all role",
        resolve: async (parent, args, context) => {
            await AuthenticationCheck(context);
            if (!AuthorizationCheck(context.user, "masterData", "view")) {
                throw Error("Forbidden");
            }
            return await roleService.getAll();
        },
    },
    role: {
        type: RoleType,
        description: "Get role by id",
        args: {
            roleId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, args, context) => {
            await AuthenticationCheck(context);
            const validArgs = ArgsValidator(roleDto.get, args);
            return await roleService.get(validArgs.roleId);
        },
    },
    searchRoles: {
        type: SearchRoleType,
        description: "Search roles with pagination",
        args: {
            query: { type: GraphQLString },
            pagination: {
                type: new GraphQLInputObjectType({
                    name: "searchRolePaginationParam",
                    fields: () => ({
                        page: { type: GraphQLInt },
                        limit: { type: GraphQLInt },
                        sort: {
                            type: new GraphQLInputObjectType({
                                name: "searchRolePaginationSortParam",
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
            if (!AuthorizationCheck(context.user, "masterData", "view")) {
                throw Error("Forbidden");
            }
            const validArgs = ArgsValidator(roleDto.search, args);

            return await roleService.search(validArgs);
        },
    },
};

const mutation = {
    createRole: {
        type: RoleType,
        description: "Create role",
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            user: {
                type: new GraphQLInputObjectType({
                    name: "createRolePermissionUser",
                    fields: {
                        view: { type: GraphQLBoolean },
                        create: { type: GraphQLBoolean },
                        update: { type: GraphQLBoolean },
                        delete: { type: GraphQLBoolean },
                    },
                }),
            },
            masterData: {
                type: new GraphQLInputObjectType({
                    name: "createRolePermissionMasterData",
                    fields: {
                        view: { type: GraphQLBoolean },
                        create: { type: GraphQLBoolean },
                        update: { type: GraphQLBoolean },
                        delete: { type: GraphQLBoolean },
                    },
                }),
            },
            desc: { type: GraphQLString },
        },
        resolve: async (parent, args, context) => {
            await AuthenticationCheck(context);
            if (!AuthorizationCheck(context.user, "masterData", "create")) {
                throw Error("Forbidden");
            }
            const validArgs = ArgsValidator(roleDto.create, args);

            return await roleService.create(validArgs);
        },
    },
    updateRole: {
        type: RoleType,
        description: "Update role",
        args: {
            _id: { type: new GraphQLNonNull(GraphQLString) },
            role: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, args, context) => {
            await AuthenticationCheck(context);
            if (!AuthorizationCheck(context.user, "masterData", "update")) {
                throw Error("Forbidden");
            }
            const validArgs = ArgsValidator(roleDto.update, args);

            return await roleService.update(validArgs);
        },
    },
    deleteRole: {
        type: RoleType,
        description: "Delete role",
        args: {
            roleId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, args, context) => {
            await AuthenticationCheck(context);
            if (!AuthorizationCheck(context.user, "masterData", "delete")) {
                throw Error("Forbidden");
            }
            const validArgs = ArgsValidator(roleDto.delete, args);

            return await roleService.delete(validArgs.roleId);
        },
    },
};

module.exports = {
    query,
    mutation,
};
