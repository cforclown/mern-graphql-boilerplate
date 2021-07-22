const express = require("express");
const validate = require("../../../middleware/validate");
const avatarController = require("../../../controller/avatar");
const avatarDto = require("../../../dto/avatar");

const router = express.Router();

router.get("/:avatarId", avatarController.get);
router.put("/", validate(avatarDto), avatarController.update);

module.exports = router;

/**
 * @swagger
 * /api/avatar/{avatarId}:
 *      get:
 *          tags:
 *              - Avatar
 *          description: Get user avatar
 *          responses:
 *              '200':
 *                  description: OK
 *          parameters:
 *          -   name: avatarId
 *              in: path
 *              required: true
 *      put:
 *          tags:
 *              - Avatar
 *          description: Update user avatar
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          requestBody:
 *              description: "Avatar data"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/avatarData'
 */
