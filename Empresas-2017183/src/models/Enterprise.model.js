'use strict'
const moongose = require("mongoose");
const Schema = moongose.Schema;

const EnterpriseSchema = Schema({
    name: {
        type: String,
        required: true
    },
    specialty: String,
    email: String,
    password: String,
    branchOffice: [{
        location: String,
        numberBranch: Number,
    }],
});

module.exports = moongose.model("enterprise",EnterpriseSchema);