const express = require("express");
const validate = require("../../../middleware/validate");
const roleController = require("../../../controller/role");
const roleDto = require("../../../dto/role");

const Router = express.Router();

Router.post("/", validate(roleDto.create), roleController.create);
Router.post("/search", validate(roleDto.search), roleController.search);

Router.get("/", roleController.getAll);
Router.get("/:roleId", roleController.get);

Router.put("/", validate(roleDto.update), roleController.update);

Router.delete("/:roleId", roleController.delete);

module.exports = Router;

/**
 * @swagger
 * /api/role:
 *      get:
 *          tags:
 *              - Role
 *          description: Get all role
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *      post:
 *          tags:
 *              - Role
 *          description: Create role
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          requestBody:
 *              description: "Create role request body"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/createRole'
 *      put:
 *          tags:
 *              - Role
 *          description: Update role
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          requestBody:
 *              description: "Update role request body"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/updateRole'
 * /api/role/search:
 *      post:
 *          tags:
 *              - Role
 *          description: Search role
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          requestBody:
 *              description: "Search request body"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/searchRole'
 * /api/role/{roleId}:
 *      get:
 *          tags:
 *              - Role
 *          description: Get role data by id
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          parameters:
 *          -   name: roleId
 *              in: path
 *              required: true
 *      delete:
 *          tags:
 *              - Role
 *          description: Delete role
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          parameters:
 *          -   name: roleId
 *              in: path
 *              required: true
 */
