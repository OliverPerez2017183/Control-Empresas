'use strict'

const express = require("express");
const app = express();
const { connection } = require("./src/database/connection");
require("dotenv").config();
const port = process.env.PORT;
const routes = require("./src/routes/enterprise.routes")

connection();

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);    
});
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use("/api", routes);