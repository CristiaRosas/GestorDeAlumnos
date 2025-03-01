import jwt from 'jsonwebtoken';

export const generarJWT =  (uid = ' ') => {
    return new Promise((resolve, reject) => {
        const playload = {uid};

        jwt.sign(
            playload,
            process.env.SECRETORPRYVATEKEY,
            {
                expiresIn: '1h'
            },
            (err, token) => {
                err ? (console.log(err), reject('Hubo un error al generar el token!')) : resolve(token);
            }
        );
    });
}