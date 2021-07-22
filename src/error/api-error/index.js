class ApiError {
    static ErrorTemplate(status, msg) {
        const err = new Error(msg);
        err.status = status;
        return err;
    }
    static unauthorized(msg) {
        return this.ErrorTemplate(401, msg);
    }
    static forbidden(msg) {
        return this.ErrorTemplate(403, msg);
    }
    static badRequest(msg) {
        return this.ErrorTemplate(400, msg);
    }
    static notFound(msg) {
        return this.ErrorTemplate(404, msg);
    }
    static internal(msg) {
        return this.ErrorTemplate(500, msg);
    }
}

module.exports = ApiError;
