const jwt = require('jsonwebtoken');

//==========================
// Verificación Token
//==========================

let verificarToken = (req, res, next) => {
    let token = req.get('token'); // Authorization

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                error: {
                    message: 'Token Invalid'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

let verificar_Admin_Role = (req, res, next) => {
    let rol = req.usuario.role;

    if (rol != 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            error: {
                message: 'El usuario no es administrador'
            }
        });
    } else {
        next();
    }
};

module.exports = {
    verificarToken,
    verificar_Admin_Role
};