import { response, request } from "express";
import {hash} from "argon2";
import User from './user.model.js';
import Course from '../courses/courses.model.js'

export const getUserById = async (req, res) => {
    try {
    
        const {id} = req.params;

        const user = await User.findById(id).populate('keeper', 'nameCourse');

        if(!user){
            return res.status(404).json({
                succes: false,
                msg: 'User not found'
            })
        }

        res.status(200).json({
            succes: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: "Error getting user",
            error
        })
    }
}


export const updateUser = async (req, res  = response) => {
    try {
        const {id} = req.params;
        const {_id, password, email, ...data} = req.body;

        if(password){
            data.password = await hash(password)
        }

        const user = await User.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            succes: true,
            msj: 'User updated successfully',
            user
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: "Error updating user",
            error
        })
    }
}


export const deleteUser = async (req, res) =>{
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { estado: false}, { new: true });
        const autheticatedUser = req.user;
        
        res.status(200).json({
            success: true,
            msg: 'User disabled',
            user,
            autheticatedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error deactivating user',
            error
        })
    }
}

export const asignarCurso = async (req, res) => {
    try {
        const {id} = req.params;
        const data = req.body;

        const course = await Course.findOne({name: data.name});   

        if(!course){
            return res.status(404).json({
                succes: false,
                message: 'This course does not exist'
            })
        }

        const updatedUser = await User.findByIdAndUpdate(id).populate('keeper', 'nameCourse' );

        if (updatedUser.keeper.length >= 3) {
            return res.status(400).json({
                success: false,
                message: 'The user cannot have more than 3 courses assigned'
            });
        }       

        updatedUser.keeper.push([course._id]);
        await updatedUser.save();

        res.status(200).json({
            success: true,
            message: 'Course assigned correctly',
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error assigning course',
            error
        })
    }
}