import { Schema, model } from "mongoose";

const UserSchema = Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            maxLength: [25, "Cant be overcome 25 characters"]
        },
        surname: {
            type: String,
            required: [true, "Surname is required"],
            maxLength: [25, "Cant be overcome 25 characters"]
        },
        username: {
            type: String,
            unique: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: 8
        },
        phone: {
            type: String,
            minLength: 8,
            maxLength: 8,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["TEACHER_ROLE", "ALUMN_ROLE"],
        },
        estado: {
            type: Boolean,
            default: true,
        },
        courses:[{
            type:Schema.Types.objectId,
            ref: 'course'
        }]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('User', UserSchema);