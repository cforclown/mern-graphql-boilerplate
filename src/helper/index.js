const CryptoJS = require("crypto-js");

exports.Hash = async function (password) {
    return await CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
};
