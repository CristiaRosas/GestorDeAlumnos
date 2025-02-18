import User from '../user/user.model.js'
import Course from './courses.model.js' 

export const createCourse = async (req, res) => {
    try {
        
        const data = req.body;

        const user = await User.findOne({email: data.email});   

        if(!user){
            return res.status(404).json({
                succes: false,
                message: 'The teacher was not found'
            })
        }

        const course = new Course({
            ...data,
            keeper: user._id,
        });

        await course.save();

        res.status(200).json({
            succes: true,
            course
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error creating course',
            error
        })
    }
}

export const showCourse = async (req, res) => {
    const {limite = 10, desde = 0} = req.query;
    const query = {status: true};

    try {
        const course = await Course.find(query)
            .populate('keeper', 'name')
            .skip(Number(desde))
            .limit(Number(limite));


        const total = await Course.countDocuments(query);

        res.status(200).json({
            succes: true,
            total,
            course
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error getting courses',
            error: error.message
        })
    }
} 


export const deleteCourse = async (req, res) => {

    const {id} = req.params;

    try {
        await Course.findByIdAndUpdate(id, {status: false});

        res.status(200).json({
            succes: true,
            message: 'Course deleted'
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error deleting course',
            error
        })
    }

}

export const updateCourse = async (req, res  = response) => {
    try {
        const {id} = req.params;
        const {_id, ...data} = req.body;

        const coruse = await Course.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            succes: true,
            msj: 'Course successfully updated',
            coruse
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: "Error updating course",
            error
        })
    }
} 
    