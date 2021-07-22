const mongoose = require("mongoose");
const ApiError = require("../error/api-error");
const userModel = mongoose.model("User");
const roleModel = mongoose.model("Role");

class UserDao {
    async create({ username, hashedPassword, email, fullname, role }) {
        let userDoc = new userModel({
            username,
            password: hashedPassword,
            email,
            fullname,
            role,
        });
        await userDoc.save();
        return userDoc;
    }

    get(userId) {
        return userModel.findById(userId).select("-password").populate("role").exec();
    }
    getAll() {
        return userModel
            .find({})
            .select("-password")
            .populate({
                path: "role",
                select: "_id name",
                model: "Role",
            })
            .exec();
    }
    async search({ query, pagination }) {
        const result = await userModel
            .aggregate([
                {
                    $lookup: {
                        from: "role",
                        localField: "role",
                        foreignField: "_id",
                        as: "role",
                    },
                },
                { $unwind: "$role" },
                {
                    $match: {
                        $or: [
                            {
                                username: {
                                    $regex: query ? query : "",
                                    $options: "i",
                                },
                            },
                            {
                                fullname: {
                                    $regex: query ? query : "",
                                    $options: "i",
                                },
                            },
                        ],
                    },
                },
                {
                    $sort:
                        pagination.sort.by === "USERNAME"
                            ? { username: pagination.sort.order === "ASC" ? 1 : -1 }
                            : pagination.sort.by === "FULLNAME"
                            ? { fullname: pagination.sort.order === "ASC" ? 1 : -1 }
                            : pagination.sort.by === "ROLE"
                            ? { "role.name": pagination.sort.order === "ASC" ? 1 : -1 }
                            : { createdAt: pagination.sort.order === "ASC" ? 1 : -1 },
                },
                { $project: { password: 0 } },
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
                pagination: {
                    ...pagination,
                    pageCount: 0,
                },
                data: [],
            };
        }

        return {
            pagination: {
                ...pagination,
                pageCount: Math.ceil(result[0].metadata[0].total / pagination.limit),
            },
            data: result[0].data,
        };
    }
    async getUserPermissions(userId) {
        const user = await userModel.findById(userId).select("-password").populate("role").exec();
        return user ? user.role : null;
    }

    async update({ _id, role }) {
        const user = await userModel.findById(_id).exec();
        if (!user) {
            throw ApiError.notFound("User not found");
        }

        user.role = role;
        await user.save();

        return user;
    }

    async delete(userId) {
        const res = await userModel.deleteOne({ _id: userId }).exec();
        if (res.n === 0) {
            return null;
        }
        return userId;
    }

    //#region PROFILE STUFF
    async updateProfile(userId, { email, fullname }) {
        const user = await userModel.findById(userId).exec();
        if (!user) {
            throw ApiError.notFound("User not found");
        }

        user.email = email;
        user.fullname = fullname;
        await user.save();

        return user;
    }
    async changeUsername(userId, username) {
        const result = await userModel.updateOne({ _id: userId }, { $set: { username } });
        if (result.n === 0) {
            return null;
        }

        return username;
    }

    async isUsernameAvailable(username, excludeUserId) {
        const user = excludeUserId ? await userModel.findOne({ _id: { $ne: excludeUserId }, username: username }) : await userModel.findOne({ username: username });
        return user ? false : true;
    }
    async isEmailAvailable(email, excludeUserId) {
        const user = excludeUserId ? await userModel.findOne({ _id: { $ne: excludeUserId }, email: email }) : await userModel.findOne({ email: email });
        return user ? false : true;
    }
    async isRoleValid(roleId) {
        const role = await roleModel.findById(roleId).exec();
        return role ? true : false;
    }
    //#endregion
}

module.exports = new UserDao();
