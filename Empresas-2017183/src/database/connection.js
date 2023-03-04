'use strict'
require('dotenv').config();
const database = process.env.DATABASE;
const moongose = require('mongoose');
moongose.set("strictQuery", true);

const connection = async () => {
    try {
        await moongose.connect(database);
        console.log("Conectado correctamente a la base de datos!    :D");
    } catch (error) {
        throw new Error(error + " Error al iniciar la Base de Datos   :'(  ");
    }
};

module.exports = {
    connection,
};