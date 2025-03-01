import User from '../user/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Correo y contraseña son requeridos' });
        }

        const user = await User.findOne({ email });

        if (!user || !user.estado) {
            return res.status(400).json({ msg: 'Usuario inexistente en la base de datos' });
        }

        const isPasswordValid = await verify(user.password, password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: 'La contraseña es incorrecta' });
        }

        const token = await generarJWT(user.id);

        return res.status(200).json({
            msg: `Bienvenido ${user.name}, has iniciado sesión con éxito!`,
            userDetails: {
                token,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Error al intentar logearse:', error);
        return res.status(500).json({
            msg: 'Error del servidor',
            error: error.message
        });
    }
};

export const registerUser = async (req, res) => {
    try {
        const data = req.body;

        const encryptedPassword = await hash(data.password);

        const user = await User.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: encryptedPassword,
            role: data.role
        })

        return res.status(201).json({
            message: `El Usuario ${user.name} fue registrado con exito!`,
            userDetails: {
                user: user.email,
                role: data.role
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Hubo un error al registrar al usuario",
            error: error.message
        })
    }
}
