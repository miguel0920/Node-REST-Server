const express = require('express');
let Categoria = require('../models/categoria');
let app = express();

const _ = require('underscore');


let { verificarToken, verificar_Admin_Role } = require('../middlewares/autenticacion');


///==========================
/// Mostrar Categorias
///==========================

app.get('/categoria', verificarToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((error, CategoriaBD) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            res.json({
                ok: true,
                categorias: CategoriaBD
            });

        });
});

///==========================
/// Mostrar Categoria por ID
///==========================

app.get('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (error, CategoriaBD) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!CategoriaBD) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            categorias: CategoriaBD
        });

    });
});

///==========================
/// Crear Categoria
///==========================

app.post('/categoria', verificarToken, (req, res) => {

    let idUsuario = req.usuario._id;
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: idUsuario
    });

    categoria.save((error, categoriaBD) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });

    });

});

///==========================
/// Actualizar Categoria
///==========================

app.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let requestCategoria = _.pick(req.body, ['descripcion']);
    Categoria.findByIdAndUpdate(id, requestCategoria, { new: true, runValidators: true }, (error, CategoriaBD) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!CategoriaBD) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            categoria: CategoriaBD
        });
    });
});

///==========================
/// Eliminar Categoria
///==========================

app.delete('/categoria/:id', [verificarToken, verificar_Admin_Role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndDelete(id, (error, categoriaBD) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'La categoria no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: 'Categoria borrada'
        })

    });
});

module.exports = app;