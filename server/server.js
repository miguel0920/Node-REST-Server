const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./config/config');
//require('./routes/usuario');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(require('./routes/usuario'));

mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true }, (err, resp) => {
    if (err) {
        throw err;
    } else {
        console.log('Base de datos Online');
    }
});

app.listen(process.env.PORT, () => console.log(`Escuchando el puerto: `, process.env.PORT));