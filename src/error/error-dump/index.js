const fs = require("fs");
const path = require("path");
const config = require("../../config");
const moment = require("moment");
const cl = require("../../console-log");

const dumpLogFolderPath = "../../../dump-log";

function ErrorDump(_err, saveLog = true) {
    if (config.NODE_ENV === "test") {
        // saveLog = false;
        return;
    }
    if (!fs.existsSync(path.join(__dirname, dumpLogFolderPath))) {
        fs.mkdirSync(path.join(__dirname, dumpLogFolderPath));
    }

    cl.LogError("======================================================================");
    if (typeof _err === "object") {
        cl.LogWarning(`MESSAGE: ${_err.message ? _err.message : ""}`);
        if (_err.codeMessage) cl.LogWarning("CODE_MSG: " + _err.codeMessage);
        if (_err.stack) {
            cl.LogDanger("STACKTRACE------------------>");
            cl.LogDanger(_err.stack);
        }

        if (saveLog) {
            const errorMessage = `
            ============================================
            MESSAGE: ${_err.message ? _err.message : ""}
            STACKTRACE:
            ${_err.stack ? _err.stack : ""}
            ============================================
            `;

            const filename = moment().format("DD MMMM YYYY") + ".txt";
            fs.appendFile(path.join(__dirname, dumpLogFolderPath + "/" + filename), errorMessage, (err) => {
                if (err) cl.LogError(err.message);
                else cl.LogDanger("Error saved");
            });
        }
    } else {
        cl.LogError("dumpError : argument is not an object");
    }
    cl.LogError("======================================================================");
}

module.exports = ErrorDump;
