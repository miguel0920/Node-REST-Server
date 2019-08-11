const express = require('express');
const bcript = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role img estado google')
        .skip(desde)
        .limit(limite)
        .exec((error, usuarios) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            Usuario.count({ estado: true }, (err, total) => {
                res.json({
                    ok: true,
                    usuarios,
                    total
                });
            });
        });
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

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioEliminado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioEliminado
        });

    });
});

module.exports = app;