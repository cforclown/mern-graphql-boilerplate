class DataResponseObject {
    constructor(data, msg) {
        this.data = data;
        this.msg = msg;
    }

    static response(data) {
        return new DataResponseObject(data, null);
    }

    static errorResponse(msg) {
        return new DataResponseObject(null, msg);
    }
}

module.exports = DataResponseObject;
