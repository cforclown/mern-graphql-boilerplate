const express = require("express");
const passport = require("passport");
const validate = require("../../middleware/validate");
const authController = require("../../controller/auth");
const authDto = require("../../dto/auth");

const router = express.Router();

router.post("/register", validate(authDto.register), authController.register);
router.post(
    "/login",
    validate(authDto.login),
    passport.authenticate("local", {
        successRedirect: "/auth/login/verify",
        failureRedirect: "/auth/login/error",
        failureFlash: true,
    })
);
router.post("/login/test", validate(authDto.login), authController.login);
router.get("/login/verify", authController.verify);
router.get("/login/error", authController.error);
router.post("/refresh", validate(authDto.refreshToken), authController.refresh);
router.delete("/logout", authController.logout);

module.exports = router;

/**
 * @swagger
 * /auth/register:
 *      post:
 *          tags:
 *              - Authentication
 *          description: Register
 *          responses:
 *              '200':
 *                  description: Register Success
 *          requestBody:
 *              description: "Register Data"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/registerData'
 * /auth/login:
 *      post:
 *          tags:
 *              - Authentication
 *          description: Login
 *          responses:
 *              '200':
 *                  description: Login Success
 *          requestBody:
 *              description: "Login Data"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/loginData'
 * /auth/refresh:
 *      post:
 *          tags:
 *              - Authentication
 *          description: Refresh Token
 *          responses:
 *              '200':
 *                  description: Token berhasil diperbarui
 *          security:
 *              - Bearer: []
 *          requestBody:
 *              description: "Refresh Token"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/refreshToken'
 * /auth/logout:
 *      delete:
 *          tags:
 *              - Authentication
 *          description: Logout berhasil
 *          responses:
 *              '200':
 *                  description: Logout Success
 *          security:
 *              - Bearer: []
 */
