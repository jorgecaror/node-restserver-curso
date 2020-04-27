const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//===============================
//Mostrar todas las categorias
//===============================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion') //ordenar por descripcion orden alfabetico respentando las mayusculas primero
        .populate('usuario', 'nombre email') // del Schema usuario, solo muestra los valores nombre y email
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                categorias

            })

        });
});

//===============================
//Mostrar una categoria por ID
//===============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    // mostrar la información de la categoria

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//===============================
//Crear nueva categoria
//===============================

app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //si no se crea la categoría
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//===============================
//Actualizar la categoria
//===============================

app.put('/categoria/:id', verificaToken, (req, res) => {
    //actualizar el nombre de la categoria
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    //busca por el id y lo actualiza
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })

});

//===============================
//Eliminar una categoria
//===============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo un administrador puede borrar categoria
    //Categoria.findByidAndRemove
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoria borrada'
        });

    })



})


module.exports = app;