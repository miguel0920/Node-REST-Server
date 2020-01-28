const express = require('express');
let Producto = require('../models/producto');

let app = express();
const { verificarToken } = require('../middlewares/autenticacion');


// ===============================
// Buscar Productos
// ===============================

app.get('/productos/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((error, productoBD) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            res.json({
                ok: true,
                producto: productoBD
            });
        });
});

// ===============================
// Obtener Productos (Paginado, Populate, TODOS)
// ===============================

app.get('/productos', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    let hasta = req.query.hasta || 5;

    desde = Number(desde);
    hasta = Number(hasta);

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(hasta)
        .exec((error, productosBD) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            res.json({
                ok: true,
                productos: productosBD
            })
        });

});

// ===============================
// Obtener Producto por Id (Populate)
// ===============================

app.get('/productos/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((error, productoBD) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            res.json({
                ok: true,
                producto: productoBD
            })
        });
});

// ===============================
// Crear Producto
// ===============================

app.post('/productos', verificarToken, (req, res) => {
    let body = req.body;
    let usuarioId = req.usuario._id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: usuarioId
    });

    producto.save({ new: true }, (error, productoBD) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                error
            })
        }

        res.json({
            ok: true,
            producto: productoBD
        });
    })

});

// ===============================
// Actualizar el producto
// ===============================

app.put('/productos/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let bodyRequest = new Producto({
        _id: id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria
    });

    Producto.findByIdAndUpdate(id, bodyRequest, { new: true, runValidators: true }, (error, productoBD) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        })
    });
});

// ===============================
// Eliminar Producto (Disponible = false)
// ===============================

app.delete('/productos/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    let bodyReq = new Producto({
        _id: id,
        disponible: false
    });

    Producto.findByIdAndUpdate(id, bodyReq, (error, productoBD) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            producto: 'Producto Borrado'
        });
    });
});

module.exports = app;