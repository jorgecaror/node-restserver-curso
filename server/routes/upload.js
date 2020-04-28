const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    //si no vienen archivos
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            message: 'Ningun archivo a sido subido'
        });

    }

    //Validar Tipo
    let tiposValidos = ['producto', 'usuario'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidas son ' + tiposValidos.join(', '),

            }
        });
    }

    let archivo = req.files.archivo; //archivo es el nombre con el que se reconocer al momento de subirlo.
    let nombreCortado = archivo.name.split('.'); //separar el nombre del archivo en el punto
    let extension = nombreCortado[nombreCortado.length - 1];

    //extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];


    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    //Cambiar nombre al archivo
    //2126849845asdsdvsdfa-123.jpg
    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`;

    //Cuando el archivo ya se subió y se almacena en la carpeta correspondiente
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        if (tipo === 'usuario') {
            //aquí la imagen ya se cargó
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }

    });

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuario')
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuario')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuario')

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });

    });
}


function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'producto')
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'producto')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'producto')

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            })
        });


    });

}

function borraArchivo(nombreImagen, tipo) {
    //la dirección de donde se guardará el archivo
    let pathImg = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    //consulta si existe un archivo previamente ardado en el path
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg) //recibe el path del archivo a eliminar
    }
}

module.exports = app;