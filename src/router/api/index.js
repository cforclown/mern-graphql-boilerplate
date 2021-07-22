const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const dro = require("../../dro");
const ErrorDump = require("../../error/error-dump");

const router = express.Router();

const userRouter = require("./router/user");
const avatarRouter = require("./router/avatar");
const roleRouter = require("./router/role");

router.use(async (req, res, next) => {
    try {
        if (req.originalUrl.includes("/api/avatar") && req.method === "GET") {
            return next();
        }
        if (req.headers["authorization"] === undefined) {
            return res.sendStatus(401);
        }

        const token = req.headers["authorization"].split(" ")[1];

        jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, user) => {
            // TOKEN NOT VALID
            if (err) {
                return res.sendStatus(401);
            }
            // ROLE USER TIDAK VALID
            if (!user.role) {
                return res.status(403).send(dro.response(null, "User ini tidak mempunyai attribute Role"));
            }

            req.user = user;

            next();
        });
    } catch (error) {
        ErrorDump(error);
        res.status(500).send(dro.response(null, error.message));
    }
});

router.use("/user", userRouter);
router.use("/avatar", avatarRouter);
router.use("/role", roleRouter);

module.exports = router;
