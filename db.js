
require("dotenv").config();

const db = () => {
    const mongoose = require('mongoose');
    const URI = process.env.URI;


    mongoose.connect(URI, {
        useNewUrlPArser: true,
        useUnifiedTopology: true,
    }).then(() => console.log('Database creada')).catch(error => console.log('Algun error ha ocurido', error))
}

module.exports = db;