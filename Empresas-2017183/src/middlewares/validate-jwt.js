const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const Enterprise = require("../models/Enterprise.model");

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({msg: "No hay token en la petición"});
    }

    try {
        const payload = jwt.decode(token, process.env.SECRET_KEY);
        const enterpriseFind = await Enterprise.findById(payload.eId);
        console.log(enterpriseFind);

        if (payload.exp <= moment().unix()) {
            return res.status(500).json({msg: "El token ha expirado."});
        }

        if (!enterpriseFind) {
            return res.status(400).send({msg: "Token no valido -Esta empresa no existe en la Base de Datos"})
        };

        req.enterprise = enterpriseFind;

        next();
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    validateJWT,
};
