const mongoose = require('mongoose');
//const uniqueValidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema;

let categoriaSchema = new Schema({

    descripcion: {
        type: String,
        unique: true,
        required: [true, 'la descripcion es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);