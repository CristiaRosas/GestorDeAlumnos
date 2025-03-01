export const tieneRole = (...roles) => {
    return (req, res, next) => {
        if(!req.usuario){
            return res.status(500).json({
                success: false,
                msg: 'Intenta verificar un rol sin validar el token primero!'
            })
        }
        
        if (!roles.includes(req.usuario.role)){
            return res.status(401).json({
                success: false,
                msg: `Usuario sin acceso, cuenta con rol ${req.usuario.role}, Los roles con acceso son ${roles}`
            })
        }

        next();
    }
}