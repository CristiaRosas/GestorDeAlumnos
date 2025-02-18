import {Router} from "express";

import {check} from "express-validator";

import { updateUser, deleteUser, asignarCurso, getUserById} from './user.controller.js';

import {existeUsuarioById} from '../helpers/db.validator.js';
import {validarCampos} from '../middlewares/validar-campos.js';


import { validarJWT } from "../middlewares/validar-jwt.js"; 


const router = Router();


router.get(
    "/BuscarUser/:id",
    [
        check("id", "It is not a valid Id").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
)

router.put(
    "/:id",
    [
        check("id", "It is not a valid Id").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
)

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "It is not a valid Id").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
)


router.put(
    "/AsignarAUnCurso/:id",
    [
        check("id", "It is not a valid Id").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    asignarCurso
) 


export default router;