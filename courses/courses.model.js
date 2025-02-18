import {Schema, model} from "mongoose";

const CoursesSchema = Schema({
    nameCourse: {
        type: String,
        required: true
    },
    descriptionCourse: {
        type: String,
        required: true
    },
    keeper: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamp: true,
    versionKey: false
});

export default model('Course', CoursesSchema);