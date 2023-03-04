'use strict'

const Enterprise = require("../models/Enterprise.model");
const bcrypt = require("bcrypt");
const { generateJWT } = require("../helpers/create-jwt");
const tokenId = require("../middlewares/validate-jwt");

//Cread Read Update Delete
//Crear Empresa
const createEnterprise = async(req, res) => {
    const { password } = req.body;
    try {
        let enterprise = new Enterprise(req.body);

        const jumps = bcrypt.genSaltSync();
        enterprise.password = bcrypt.hashSync(password, jumps);

        enterprise = await enterprise.save();

        const token = await generateJWT(enterprise.id, enterprise.name, enterprise.email);
        res.status(200).send({
            msg: `Empresa ${enterprise.name} creado correctamente`,
            enterprise,
            token,
        });
    } catch (error) {
        throw new Error(error);
    }
};

//Listar Empresas
const listEnterprise = async(req, res) => {
    try {
        const enterprises = await Enterprise.find();
        if (!enterprises) {
            res.status(404).send({msg: "No hay empresas registradas en la base de datos"});
        } else {
            res.status(200).send({"Empresas registradas": enterprises});
        }
    } catch (error) {
        throw new Error(error);
    }
};

//Actualizar Empresa
const updateEnterprise = async(req, res) => {

    try {
        const id = req.params.id;
        const enterEdit = {...req.body};

        enterEdit.password = enterEdit.password
            ? bcrypt.hashSync(enterEdit.password, bcrypt.genSaltSync())
            : enterEdit.password;
        const enterComplete = await Enterprise.findByIdAndUpdate(id, enterEdit, {
            new: true,
        });
        if (enterComplete) {
            const token = await generateJWT(
                enterComplete.id,
                enterComplete.name,
                enterComplete.email
            );
            return res.status(200).json({
                msg: "Empresa actualizada correctamente",
                enterComplete,
                token,
            });
        } else {
            res.status(404).send({
                msg: "Esta empresa no existe en la base de datos."
            })
        }
    } catch (error) {
        throw new Error(error);
    }
};

//Eliminar Empresa
const deleteEnterprise = async(req, res) => {
    try {
        const id = req.params.id;
        const enterDelete = await Enterprise.findByIdAndDelete(id);
        return res.status(200).send({msg: "Empresa eliminada correctamente", enterDelete});
    } catch (error) {
        throw new Error(error);
    }
};

//Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const enterpri = await Enterprise.findOne({ email });
        if (!enterpri) {
            return res.status.send({msg: "Esta empresa no existe"});
        };
        const validPassword = bcrypt.compareSync(password, enterpri.password);
        if(!validPassword){
            return res.status(400).send({ 
                ok: false, 
                msg: "Contraseña incorrecta"});
        }

        const token = await generateJWT(enterpri.id, enterpri.name, enterpri.email);
        res.send({
            ok: true,
            eId: enterpri.id,
            name: enterpri.name,
            email: enterpri.email,
            token,
        })
    } catch (error) {
        throw new Error(error);
    }
};

//Crud Sucursales

const addBranch = async (req, res) => {
    try {
        const id = req.params.id;
        const { location, numberBranch } = req.body;

        const branch = await Enterprise.findByIdAndUpdate(
            id,
            {
              $push: {
                branchOffice: {
                  location: location,
                  numberBranch: numberBranch,
                },
              },
            },
            { new: true }
          );
        if (!branch) {
            return res.status(404).send({ msg: "Empresa no encontrada"});
        }
        return res.status(200).send({ branch });
    } catch (error) {
        throw new Error(error);
    }
};

const deleteOffice = async(req, res) =>{
    const id = req.params.id;
    const {idbranchOffice} = req.body;
    try {
       const  deleteOffice = await Enterprise.updateOne(
           {id},
           {
               $pull: {branchOffice: {_id: idbranchOffice}},
           },
           {new: true, multi: false}
       );
       if(!deleteOffice){
           return res.status(404).send({msg:"no existe la sucursal"});
       }

       return res.status(200).send({deleteOffice});
    } catch (error) {
       throw new Error(error);
    }
};

const updateBranch = async (req, res) =>{
    const id = req.params.id;
    const { idBranch, location, numberBranch } = req.body;
    try {
        const updateOffice = await Enterprise.updateOne(
            {_id: id, "branchOffice._id": idBranch },
            {
                $set: {
                    "branchOffice.$.location": location,
                    "branchOffice.$.numberBranch": numberBranch,
                },
            },
            {new: true}
        );

        if (!updateOffice) {
            return res.status(404).send({msg: "Esta empresa no existe"})
        }

        return res.status(200).send({updateOffice, msg:"Sucursal agregada correctamente" })
    } catch (error) {
        throw new Error(error);
    }
}


module.exports = {
    createEnterprise,
    listEnterprise,
    updateEnterprise,
    deleteEnterprise,
    login,
    addBranch,
    deleteOffice,
    updateBranch,
};