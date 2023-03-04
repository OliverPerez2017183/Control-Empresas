const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET_KEY;

const generateJWT = async(eId, name, email) => {
    const payload = {eId, name, email};
    try {
        const token = await jwt.sign(payload, secret, {
            expiresIn: "25min",
        });
        return token;
    } catch (error) {
        throw new Error(`Error al generar el token ${error}`);
    }
}

module.exports = { generateJWT };