import User from '../user/user.model.js'
import Course from './courses.model.js' 

export const createCourse = async (req, res) => {
    try {
        const { email, ...courseData } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'profesor no encontrado en la base de datos'
            });
        }

        if (user.role !== 'TEACHER_ROLE') {
            return res.status(403).json({
                success: false,
                message: 'Solo usuarios con TEACHER_ROLE Pueden crear cursos!'
            });
        }

        const course = await Course.create({
            ...courseData,
            relacion: user._id
        });

        return res.status(201).json({
            success: true,
            course
        });
    } catch (error) {
        console.error('Hubo un error al crear el curso:', error);
        return res.status(500).json({
            success: false,
            msg: 'Error al crear el curso',
            error: error.message
        });
    }
};

export const showCourse = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [courses, total] = await Promise.all([
            Course.find(query)
                .populate('relacion', 'name')
                .skip(Number(desde))
                .limit(Number(limite)),
            Course.countDocuments(query)
        ]);

        return res.status(200).json({
            success: true,
            total,
            courses
        });
    } catch (error) {
        console.error('Hubo un error al mostrar los cursos:', error);
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener los cursos',
            error: error.message
        });
    }
};



export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'No se encontro el curso en la base de datos'
            });
        }

        course.status = false;
        await course.save();

        return res.status(200).json({
            success: true,
            message: 'El curso fue eliminado exitosamente!'
        });
    } catch (error) {
        console.error('Hubo un error al eliminar el curso:', error);
        return res.status(500).json({
            success: false,
            msg: 'Error al eliminar el curso',
            error: error.message
        });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({
                success: false,
                msg: 'No se encontro el curso en la base de datos'
            });
        }

        Object.assign(course, data);
        await course.save();

        return res.status(200).json({
            success: true,
            msg: 'Actualizacion del curso exitosa!',
            course
        });
    } catch (error) {
        console.error('Hubo un error al actualizar el curso:', error);
        return res.status(500).json({
            success: false,
            msg: 'Error al actualizar el curso',
            error: error.message
        });
    }
};
    