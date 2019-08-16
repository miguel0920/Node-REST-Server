const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Ruta Carpeta Publica
app.use(express.static(path.resolve(__dirname, '../public')));

// parse application/json
app.use(bodyParser.json());

//Configuración global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, resp) => {
    if (err) {
        throw err;
    } else {
        console.log('Base de datos Online');
    }
});

app.listen(process.env.PORT, () => console.log(`Escuchando el puerto: `, process.env.PORT));