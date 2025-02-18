import { Router } from "express";
import { check } from "express-validator";
import { createCourse, showCourse, deleteCourse, updateCourse } from "./courses.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check('email', 'This is not a valid email').not().isEmpty(),
        validarCampos
    ],
    createCourse
)

router.get("/", showCourse)


router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check("id", "It is not a valid id").isMongoId(),
        validarCampos         
    ],
    deleteCourse
)

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check("id", "It is not a valid id").isMongoId(),
        validarCampos
    ],
    updateCourse
)

export default router;