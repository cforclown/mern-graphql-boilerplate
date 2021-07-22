const mongoose = require("mongoose");

const roles = [
    {
        _id: mongoose.Types.ObjectId(),
        name: "Super Admin",
        user: { view: true, create: true, update: true, delete: true },
        masterData: { view: true, create: true, update: true, delete: true },
        desc: "Super admin role. Allowed to view, create, modify and delete data. Default. This role cannot be deleted",
        isDefaultNormal: false,
        editable: false,
    },
    {
        _id: mongoose.Types.ObjectId(),
        name: "Admin",
        user: { view: true, create: true, update: true, delete: true },
        masterData: { view: true, create: true, update: true, delete: true },
        desc: "Admin role. Allowed to view, create, modify and delete data. Default. This role cannot be deleted",
        isDefaultNormal: false,
        editable: false,
    },
    {
        _id: mongoose.Types.ObjectId(),
        name: "Normal",
        user: { view: true, create: false, update: false, delete: false },
        masterData: { view: true, create: false, update: false, delete: false },
        desc: "Normal role. Only allowed to view data. Default. This role cannot be deleted",
        isDefaultNormal: true,
        editable: false,
    },
];
const users = [
    {
        _id: mongoose.Types.ObjectId(),
        username: "superadmin",
        password: "2b64f2e3f9fee1942af9ff60d40aa5a719db33b8ba8dd4864bb4f11e25ca2bee00907de32a59429602336cac832c8f2eeff5177cc14c864dd116c8bf6ca5d9a9", // toor
        email: "superadmin@mail.com",
        fullname: "Super Admin",
        avatar: null,
        role: roles[0]._id,
    },
    {
        _id: mongoose.Types.ObjectId(),
        username: "admin",
        password: "99adc231b045331e514a516b4b7680f588e3823213abe901738bc3ad67b2f6fcb3c64efb93d18002588d3ccc1a49efbae1ce20cb43df36b38651f11fa75678e8", // root
        email: "admin@mail.com",
        fullname: "Admin",
        avatar: null,
        role: roles[1]._id,
    },
];

module.exports = {
    roles,
    users,
};
