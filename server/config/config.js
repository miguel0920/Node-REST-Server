//==========================
// Variables Globales
//==========================

//==========================
// Puerto
//==========================
process.env.PORT = process.env.PORT || 3000;

//==========================
// Entorno
//==========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==========================
// Tiempo Caducidad Token
//==========================
// 60 Segundos
// 60 Minutos
// 24 Horas
// 30 Dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24;

//==========================
// SEED Token
//==========================

process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'secret_desarrollo';

//==========================
// Base de datos
//==========================

let urlBD;
if (process.env.NODE_ENV == 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = process.env.MONGO_URL;
}

process.env.URLDB = urlBD;