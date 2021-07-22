const express = require("express");
const validate = require("../../../middleware/validate");
const userDto = require("../../../dto/user");
const userController = require("../../../controller/user");
const router = express.Router();

router.post("/", validate(userDto.create), userController.create);
router.post("/search", validate(userDto.search), userController.search);

router.get("/", userController.getAll);
router.get("/:userId", userController.get);
router.get("/permissions/:userId", userController.getPermissions);

router.put("/", validate(userDto.update), userController.update);

router.delete("/:userId", userController.delete);

//#region PROFILE STUFF
router.get("/profile/:userId", userController.getProfile);

router.put("/profile", validate(userDto.updateProfile), userController.updateProfile);
router.put("/profile/username", validate(userDto.changeUsername), userController.changeUsername);
//#endregion

module.exports = router;

/**
 * @swagger
 * /api/user:
 *      get:
 *          tags:
 *              - User
 *          description: Get User List
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *      post:
 *          tags:
 *              - User
 *          description: Create user
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          requestBody:
 *              description: "User data"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/userData'
 *      put:
 *          tags:
 *              - User
 *          description: Update user
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          requestBody:
 *              description: "User data"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/userData'
 * /api/user/search:
 *      post:
 *          tags:
 *              - User
 *          description: Search users
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          requestBody:
 *              description: "Search users"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/searchUser'
 * /api/user/{userId}:
 *      get:
 *          tags:
 *              - User
 *          description: Get User Data
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          parameters:
 *          -   name: userId
 *              in: path
 *              required: true
 *      delete:
 *          tags:
 *              - User
 *          description: Delete user
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          parameters:
 *          -   name: userId
 *              in: path
 *              required: true
 * /api/user/permissions/{userId}:
 *      get:
 *          tags:
 *              - User
 *          description: Get User Permissions
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          parameters:
 *          -   name: userId
 *              in: path
 *              required: true
 */
