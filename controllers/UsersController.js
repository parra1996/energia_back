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

        //SERIA BUENA IDEA SOLICITAR COMPROBACION DE NO REPETIR NICK
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


    try {
        await User.findOneAndUpdate({
            _id: _id
        }, {
            $push: {
                pokemons: {
                    "id_pokemon" : req.body.id_pok,
                    "imagen" : req.body.imagen,
                    "nombre" : req.body.nombre,
                    "elemento" : req.body.elemento,
                    "vida" : req.body.vida,
                    "ataque" : req.body.ataque,
                    "a_especial" : req.body.a_especial,
                    "velocidad" : req.body.velocidad,
                    "defensa" : req.body.defensa
                }
            }
        })
        res.send("pokemon has been captured")

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


    // Enviar Mensaje al usuario que ya sigue a esa persona
    try {
        await User.findOneAndUpdate({
            _id: _id
        }, {
            $set: {
                "userName": userName,
                "password": password,
            },
        });
        res.send("Has modificado los datos correctamente");
    } catch (error) {
        res.send(error);
    }
};

UsersController.userProfile = async (req, res) => {

    let _id = req.body._id

    try {

        User.findById({
            _id: _id
        }).then(data => {
            res.send(data)
        }).catch(error => {
            res.send(error)
        })

    } catch (error) {

        res.send(error)
    }
}

UsersController.userfollowed = async (req, res) => {

    let _id = req.body._id

    let id_followed = req.body.id_followed
    let name_followed = req.body.name_followed
    let userName_followed = req.body.userName_followed

    // Enviar Mensaje al usuario que ya sigue a esa persona
    try {

        await User.findOneAndUpdate({
            _id: id_followed
        }, {
            $push: {
                followers: {
                    "id_follower": _id
                }
            }
        })
        await User.findOneAndUpdate({
            _id: _id
        }, {
            $push: {
                followed: {
                    "id_followed": id_followed,
                    "name_followed": name_followed,
                    "userName_followed": userName_followed
                }
            }
        })
        await User.findById({
            _id: _id
        }).then(data => {
            res.send(data)
        }).catch(error => {
            res.send(error)
        })

    } catch (error) {
        res.send(error)
    }
}

UsersController.userUnfollow = async (req, res) => {
    console.log(req.body, "entra a unfollow")
    let unfollowedId = req.body.unfollowedId;
    let userId = req.body.userId;
    console.log(unfollowedId, userId, "entra a unfollow")
    //Create empty array for manage the followed field
    let followed = [];
    try {

        //Find user unfollowed to clean the followers array
        await User.find({
            _id: unfollowedId
        }).then(elmnt => {
            //Save actual followers array the variable
            let followers = elmnt[0].followers;

            //Find desired user id to unfollow
            for (let i = 0; i < followers.length; i++) {
                if (followers[i].id_follower == userId) {
                    //remove it of followers array
                    followers.splice(i, 1)
                    console.log("entramos en el if")
                }
            }
            console.log(followers, "resultado de followers antes de actualizar el campo")

            //Update followers users
            User.updateOne({
                _id: unfollowedId
            }, {

                $set: {

                    followers: followers
                }
            }).then(data => {
                console.log(data, "resultado de followers despues de actualizar el campo")
            }).catch(error => {
                console.log(error)
            })
        })


        //Find owner user to clean the followed array
        await User.find({
            _id: userId
        }).then(elmnt => {
            //Save actual followed array the variable
            followed = elmnt[0].followed;

            //Find desired user id to unfollow
            for (let i = 0; i < followed.length; i++) {
                if (followed[i].id_followed == unfollowedId) {
                    //remove it of followed array
                    followed.splice(i, 1)
                }
            }

            //Update followed users
            User.updateOne({
                    _id: userId
                }, {

                    $set: {

                        followed: followed
                    }
                }) //If promise is done, response the edited user
                .then(elmnt => {
                    User.find({
                        _id: userId
                    }).then(user => {
                        res.send(user)
                    })
                })
        })

    } catch (error) {
        res.send(error);
    }

}

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

// UsersController.userSearchByUserName = async (req, res) => {

//     let userName = req.params.userName;

//     User.find({
//         userName: userName
//     }).then(data => {
//         res.send(data)
//     }).catch(error => {
//         res.send(error)
//     })
// }

module.exports = UsersController;