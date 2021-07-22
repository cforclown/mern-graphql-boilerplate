const LocalStrategy = require("passport-local");

function Initialize(passport) {
    const authService = require("../service/auth");

    const authenticateCallback = async (username, password, done) => {
        try {
            const user = await authService.authenticate({ username, password });
            if (!user) {
                return done(null, false, { message: "User not found" });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    };

    passport.use(new LocalStrategy(authenticateCallback));
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (userId, done) => {
        const user = await authService.getUser(userId);
        if (!user) {
            return done(null, false, { message: "Deserialize User Error. User not found" });
        }
        return done(null, user);
    });
}

module.exports = Initialize;
