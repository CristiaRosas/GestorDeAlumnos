import {Router} from "express";
import {check} from "express-validator";
import { updateUser, deleteUser, asignarCurso, getUserById, getUsers, updatePassword} from './user.controller.js';
import {existeUsuarioById} from '../helpers/db.validator.js';
import {validarCampos} from '../middlewares/validar-campos.js';


import { validarJWT } from "../middlewares/validar-jwt.js"; 


const router = Router();


router.get("/", getUsers);

router.get(
    "/BuscarUser/:id",
    [
        check("id", "No es valido Id").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
)

router.put(
    "/:id",
    [
        check("id", "No es valido Id").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
)

router.put(
    "/updatePassword/:id",
    [
        check("id", "No es un Id válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updatePassword
)

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es valido Id").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
)


router.put(
    "/AsignarAUnCurso/:id",
    [
        check("id", "No es valido Id").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    asignarCurso
) 


export default router;