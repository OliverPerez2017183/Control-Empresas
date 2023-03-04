'use strict'

const { Router } = require("express");
const { 
    createEnterprise, 
    listEnterprise, 
    updateEnterprise,
    deleteEnterprise,
    addBranch,
    updateBranch,
    login,
    deleteOffice
} = require("../controllers/enterprise.controller");
const {check} = require("express-validator");
const {validateParams} = require("../middlewares/validate-params");
const {validateJWT} = require("../middlewares/validate-jwt");

const api = Router();

api.post("/create-enterprise", createEnterprise);
api.get("/list-enterprise", listEnterprise);
api.put("/edit-enterprise/:id", updateEnterprise,);
api.delete("/delete-enterprise/:id", deleteEnterprise);
api.put("/add-office/:id", addBranch);
api.delete("/delete-office/:id", deleteOffice);
api.put("/update-branch/:id", updateBranch);
api.post("/login", login);

module.exports = api;