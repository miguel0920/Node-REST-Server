const express = require('express');
const bcript = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');

app.get('/usuario', function(req, res) {
    res.json('Get Usuarios');
});

app.post('/usuario', function(req, res) {
    let requestUsuario = req.body;

    let usuario = new Usuario({
        nombre: requestUsuario.nombre,
        email: requestUsuario.email,
        password: bcript.hashSync(requestUsuario.password, 10),
        role: requestUsuario.role
    });

    usuario.save((error, usuarioBD) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        //Devolver la propiedad password con el valor: null
        //usuario.password = null

        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let RequestUser = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, RequestUser, { new: true, runValidators: true }, (error, userBD) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            usuario: userBD
        });
    });


});

app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});

module.exports = app;