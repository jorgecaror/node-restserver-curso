const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');



//================================
//Obtener todos los productos
//================================
app.get('/producto', verificaToken, (req, res) => {
    //trae todos los productos
    // populate: usuario categoria
    //paginado

    let desde = req.query.desde || 0; //desde que orden son mostrados
    desde = Number(desde); //combertir en número un String

    let limite = req.query.limite || 5; //cuantos serán mostrados
    limite = Number(limite);

    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos

            });
        });
});

//================================
//Obtener un producto por id
//================================
app.get('/producto/:id', verificaToken, (req, res) => {
    // populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });

});
//================================
//buscar un producto
//================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        })


});


//================================
//crear un producto
//================================
app.post('/producto', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id,
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });


});

//================================
//actualizar un producto
//================================
app.put('/producto/:id', verificaToken, (req, res) => {
    //actualiza nombre del producto
    let id = req.params.id;
    let body = req.body;

    // let actualProducto = {
    //     nombre: body.nombre,
    //     categoria: body.categoria,
    //     disponible: body.disponible,
    //     descripcion: body.descripcion,
    // }



    // //buscar por id y actualizar
    // Producto.findByIdAndUpdate(id, actualProducto, { new: true, runValidators: true }, (err, productoDB) => {
    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!productoDB) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         producto: productoDB
    //     });

    // });

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });

        });


    });
});

//================================
//Borrar un producto
//================================
app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // disponible pasar a falso
    let id = req.params.id;

    // let cambioDisponible = {
    //     disponible: false,
    // }

    // Producto.findByIdAndUpdate(id, cambioDisponible, { new: true }, (err, productoEstado) => {

    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             err
    //         });
    //     };

    //     if (!productoEstado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'ID no encontrado'
    //             }
    //         });

    //     }

    //     res.json({
    //         ok: true,
    //         producto: productoEstado
    //     });


    // });

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });

        })

    })


});



module.exports = app;