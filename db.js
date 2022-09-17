const db = () => {
    const mongoose = require('mongoose');
    // const clave = process.env.DB_CLAVE;
    // const database = process.env.DB_DATABASE;
    // const usuario = process.env.DB_USUARIO;
    // const cluster = process.env.DB_CLUSTER;

    const url = `mongodb+srv://juan:1234@cluster0.oyrs41k.mongodb.net/?retryWrites=true&w=majority`;

    mongoose.connect(url, {
        useNewUrlPArser: true,
        useUnifiedTopology: true,
    }).then(() => console.log('Database creada')).catch(error => console.log('Algun error ha ocurido', error))
}

module.exports = db;