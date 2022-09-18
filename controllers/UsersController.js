const UsersController = {};
const authConfig = require('../config/auth');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

UsersController.userRegister = async (req, res) => {

    //Registrando un usuario
    let userName = req.body.userName;
    let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds));
    let pokemons = req.body.pokemons;

    //Comprobación de errores.....
    User.find({
        userName: userName

    }).then(datosRepetidos => {

        if (datosRepetidos == false) {

            User.create({
                userName: userName,
                password: password,
                pokemons: pokemons,
            }).then(user => {
                res.send(`${user.userName}, Has sido registrado con exito`);
            }).catch((error) => {
                res.send(error);
            });
        } else {
            res.send("El usuario con ese e-mail ya existe en nuestra base de datos");
        }
    }).catch(error => {
        res.send(error)
    });
};

UsersController.atrapar = async (req, res) => {

    let _id = req.body._id

    let id_pokemon = req.body.id_pokemon
    let imagen = req.body.imagen
    let nombre = req.body.nombre
    let elemento = req.body.elemento
    let vida = req.body.vida
    let ataque = req.body.ataque
    let a_especial = req.body.a_especial
    let velocidad = req.body.velocidad
    let defensa = req.body.defensa
    let capturado = false;

    try {

        await User.find({
            _id: _id
        }).then(datos => {
            let cantidadPokemons = datos[0].pokemons.length;

            if(cantidadPokemons >= 0){
                for (let i = 0; i < cantidadPokemons; i++) {
                    if (datos[0].pokemons[i]?.id_pokemon === id_pokemon) {
                        console.log(i, "ESTO ES I")
                        console.log(datos[0].pokemons[i]?.id_pokemon, id_pokemon)
                        capturado = true
                    } else {
                        capturado = false
                    }
                }
            }

            console.log(cantidadPokemons, "RESULTADO")
        })

        if (capturado == false) {
            console.log("entramos")
            await User.findOneAndUpdate({
                _id: _id
            }, {
                $push: {
                    pokemons: {
                        "id_pokemon": id_pokemon,
                        "imagen": imagen,
                        "nombre": nombre,
                        "elemento": elemento,
                        "vida": vida,
                        "ataque": ataque,
                        "a_especial": a_especial,
                        "velocidad": velocidad,
                        "defensa": defensa
                    }
                }
            })
            res.send("pokemon has been captured")
        } else {
            console.log("entramos al else")
            res.send("you already have this pokemon")
        }


    } catch (error) {
        res.send(error)
    }

}

UsersController.liberar = async (req, res) => {
    let _id = req.body._id

    try {

        User.pokemons.pull(_id);
        User.save();
        res.send("se hizo")

    } catch (error) {
        res.send(error);
    }

}

UsersController.mostrar = async (req, res) => {
    let _id = req.params._id
    console.log(_id)

    try {

        User.findById({
            _id: _id
        }).then(data => {
            res.send(data.pokemons)
        }).catch(error => {
            res.send(error)
        })

    } catch (error) {

        res.send(error)
    }
}

UsersController.allUser = async (req, res) => {

    try {

        await User.find()
            .then(data => {
                res.send(data)
            }).catch(error => {
                res.send(error)
            })

    } catch (error) {

        res.send(error)
    }
}

UsersController.userDelete = async (req, res) => {

    let _id = req.body._id

    try {


        await User.findByIdAndDelete({
                _id: _id
            })
            .then(userDelete => {
                console.log(userDelete);
                res.send(`El usuario con el nombre ${userDelete.userName} ha sido eliminado`);
            }).catch(error => {
                res.send(error)
            })

    } catch (error) {
        res.send(error);
    }
}

UsersController.userUpdate = async (req, res) => {
    let _id = req.body._id;
    let userName = req.body.userName;
    let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds));

    try {
        await User.findOneAndUpdate({
            _id: _id
        }, {
            $set: {
                userName: userName,
                password: password,
            },
        });
        res.send("Has modificado los datos correctamente");
    } catch (error) {
        res.send(error);
    }
};

UsersController.userLogin = async (req, res) => {

    let userName = req.body.userName;
    let password = req.body.password;

    User.findOne({
        userName: userName
    }).then(Usuario => {

        if (!Usuario) {
            res.send("Usuario o contraseña inválido");

        } else {

            if (bcrypt.compareSync(password, Usuario.password)) { //COMPARA CONTRASEÑA INTRODUCIDA CON CONTRASEÑA GUARDADA, TRAS DESENCRIPTAR

                let token = jwt.sign({
                    user: Usuario
                }, authConfig.secret, {
                    expiresIn: authConfig.expires
                });

                Usuario.token = token
                res.json({
                    user: Usuario,
                    token: token,
                    loginSucces: true
                })

            } else {
                res.status(401).json({
                    msg: "Usuario o contraseña inválidos"
                });
            }
        };

    }).catch(error => {
        res.send(error);
    })

}


module.exports = UsersController;