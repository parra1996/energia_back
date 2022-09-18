const db = () => {
    const mongoose = require('mongoose');
    const url = `mongodb+srv://juan:1234@cluster0.oyrs41k.mongodb.net/test?retryWrites=true&w=majority`;

    mongoose.connect(url, {
        useNewUrlPArser: true,
        useUnifiedTopology: true,
    }).then(() => console.log('Database creada')).catch(error => console.log('Algun error ha ocurido', error))
}

module.exports = db;