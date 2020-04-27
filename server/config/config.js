//==========
//Puerto
//==========

process.env.PORT = process.env.PORT || 3000;

//==========
//Entorno
//==========

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==========
//Venciiento del Token
//==========
//60 seg
//60 min
//24 hrs
//30 dias

process.env.CADUCIDAD_TOKEN = '48h';


//==========
//SEED de autentificación
//==========

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//==========
//Base de datos
//==========

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;

//==========
//Google Client ID
//==========


process.env.CLIENT_ID = process.env.CLIENT_ID || '255415629026-9lasjvg36292l29mu6ri4r090i7l3v4u.apps.googleusercontent.com';