const mongoose = require('mongoose')
const { type } = require('os')
const { setFlagsFromString } = require('v8')

const Schema = mongoose.Schema


const userSchema = new Schema({

    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    pokemons :[
        {
        id_pokemon: Number,
        imagen: String,
        nombre: String,
        elemento: String,
        vida: Number,
        ataque: Number,
        a_especial: Number,
        velocidad: Number,
        defensa: Number,
        }
    ],
    created: {
        type: Date,
        default: new Date()
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User