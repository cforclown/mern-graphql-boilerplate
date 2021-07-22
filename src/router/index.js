const express = require("express");

const router = express.Router();

const apiRouter = require("./api");
const authRouter = require("./auth");

router.use("/api", apiRouter);
router.use("/auth", authRouter);

module.exports = router;
