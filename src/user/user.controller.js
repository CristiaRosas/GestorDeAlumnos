import { response, request } from "express";
import {hash} from "argon2";
import User from './user.model.js';
import Course from '../courses/courses.model.js'

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };
        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);
 
        res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Hubo un error al obtener el usuario",
            error
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).populate('relacion', 'nameCourse');

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario inexistente en la base de datos'
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Hubo un error al obtener el usuario:', error);
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener el usuario',
            error: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, password, email, ...updateData } = req.body;

        if (password) {
            updateData.password = await hash(password);
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'No se pudo encontrar el Usuario'
            });
        }

        Object.assign(user, updateData);
        await user.save();

        return res.status(200).json({
            success: true,
            msg: 'El Usuario fue actualizado con éxito!',
            user
        });
    } catch (error) {
        console.error('Hubo un error al actualizar el Usuario:', error);
        return res.status(500).json({
            success: false,
            msg: 'Error al actualizar el usuario',
            error: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'No se pudo encontrar el Usuario'
            });
        }

        user.estado = false;
        await user.save();

        return res.status(200).json({
            success: true,
            msg: 'El usuario fue deshabilitado con exito!',
            user,
            authenticatedUser: req.user
        });
    } catch (error) {
        console.error('Hubo un error al desactivar el usuario:', error);
        return res.status(500).json({
            success: false,
            msg: 'Error al desactivar usuario',
            error: error.message
        });
    }
};


export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                msg: 'La contraseña es obligatoria!'
            });
        }

        const hashedPassword = await hash(password);
        await User.findByIdAndUpdate(id, { password: hashedPassword });

        return res.status(200).json({
            success: true,
            msg: 'La contraseña fue actualizada con exito!'
        });
    } catch (error) {
        console.error('Hubo un error al actualizar la contraseña:', error);
        return res.status(500).json({
            success: false,
            msg: 'No se pudo actualizar la contraseña',
            error: error.message
        });
    }
};

export const asignarCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const [course, user] = await Promise.all([
            Course.findOne({ name }),
            User.findById(id).populate('relacion')
        ]);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'El curso que busca no existe'
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'El usuario no fue encontrado en la base de datos'
            });
        }

        if (user.relacion.some(c => c._id.toString() === course._id.toString())) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya tiene asignado este curso'
            });
        }

        if (user.relacion.length >= 3) {
            return res.status(400).json({
                success: false,
                message: 'El usuario tiene más de 3 cursos asignados!'
            });
        }


        user.relacion.push(course._id);
        await user.save();

        return res.status(200).json({
            success: true,
            message: `Se asignó el curso de ${course.name} de manera exitosa!`,
            user
        });
    } catch (error) {
        console.error('Hubo un error al asignar el curso:', error);
        return res.status(500).json({
            success: false,
            msg: 'Error al asignar el curso',
            error: error.message
        });
    }
};
