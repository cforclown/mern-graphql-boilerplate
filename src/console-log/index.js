class ConsoleLog {
    static B(text) {
        return `\x1b[34m${text}\x1b[0m`;
    }
    static Info(text) {
        return `\x1b[34m${text}\x1b[0m`;
    }

    static G(text) {
        return `\x1b[32m${text}\x1b[0m`;
    }
    static Success(text) {
        return `\x1b[32m${text}\x1b[0m`;
    }
    static LogSuccess(text) {
        console.log(`\x1b[32m${text}\x1b[0m`);
    }
    static LogBgSuccess(text) {
        console.log(`\x1b[30m\x1b[42m${text}\x1b[0m`);
    }

    static M(text) {
        return `\x1b[35m${text}\x1b[0m`;
    }
    static Secondary(text) {
        return `\x1b[35m${text}\x1b[0m`;
    }
    static LogSecondary(text) {
        console.log(`\x1b[35m${text}\x1b[0m`);
    }

    static Y(text) {
        return `\x1b[33m${text}\x1b[0m`;
    }
    static Warning(text) {
        return `\x1b[33m${text}\x1b[0m`;
    }
    static LogWarning(text) {
        console.log(`\x1b[33m${text}\x1b[0m`);
    }

    static R(text) {
        return `\x1b[31m${text}\x1b[0m`;
    }
    static Danger(text) {
        return `\x1b[31m${text}\x1b[0m`;
    }
    static LogDanger(text) {
        console.log(`\x1b[31m${text}\x1b[0m`);
    }

    static E(text) {
        return `\x1b[30m\x1b[41m${text}\x1b[0m`;
    }
    static Error(text) {
        return `\x1b[30m\x1b[41m${text}\x1b[0m`;
    }
    static LogError(text) {
        console.log(`\x1b[30m\x1b[41m${text}\x1b[0m`);
    }
}

module.exports = ConsoleLog;
