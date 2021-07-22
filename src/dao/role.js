const mongoose = require("mongoose");
const ApiError = require("../error/api-error");

const roleModel = mongoose.model("Role");

class RoleDao {
    constructor() {
        this.create = this.create.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create({ name, masterData, user, desc }) {
        const roleDocument = new roleModel({
            name,
            masterData,
            user,
            desc,
        });
        await roleDocument.save();

        return roleDocument;
    }

    get(roleId) {
        return roleModel.findById(roleId).exec();
    }
    getAll() {
        return roleModel.find({ isArchived: false }).exec();
    }
    async search({ query, pagination }) {
        const result = await roleModel
            .aggregate([
                {
                    $match: {
                        name: {
                            $regex: query ? query : "",
                            $options: "i",
                        },
                    },
                },
                {
                    $sort: pagination.sort.by === "NAME" ? { name: pagination.sort.order === "ASC" ? 1 : -1 } : { createdAt: pagination.sort.order === "ASC" ? 1 : -1 },
                },
                {
                    $facet: {
                        metadata: [{ $count: "total" }, { $addFields: { page: pagination.page } }],
                        data: [{ $skip: (pagination.page - 1) * pagination.limit }, { $limit: pagination.limit }],
                    },
                },
            ])
            .exec();

        if (result[0].metadata.length === 0 || result[0].data.length === 0) {
            return {
                query,
                pagination: {
                    ...pagination,
                    pageCount: 0,
                },
                data: [],
            };
        }

        return {
            query,
            pagination: {
                ...pagination,
                pageCount: Math.ceil(result[0].metadata[0].total / pagination.limit),
            },
            data: result[0].data,
        };
    }

    async update({ _id, name, masterData, user, desc }) {
        const role = await roleModel.findById(_id).exec();
        if (!role) {
            return null;
        }
        if (!role.editable) {
            throw Error("Role is not editable");
        }

        role.name = name;
        role.user = user;
        role.masterData = masterData;
        role.desc = desc ? desc : role.desc;
        await role.save();

        return role;
    }

    async delete(roleId) {
        const role = await roleModel.findById(roleId).exec();
        if (!role) {
            return null;
        }
        if (!role.editable) {
            return null;
        }

        role.isArchived = true;
        await role.save();

        return role;
    }
}

module.exports = new RoleDao();
