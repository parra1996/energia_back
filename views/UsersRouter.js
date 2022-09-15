const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/UsersController");


router.post("/", UsersController.userRegister);

router.get("/", UsersController.allUser);

router.delete("/", UsersController.userDelete);

router.delete("/poke", UsersController.pokeDelete);

router.put("/", UsersController.userUpdate);

router.post('/atrapar', UsersController.atrapar)

router.post('/mostrar/:_id', UsersController.mostrar)

// router.get("/profile", UsersController.userProfile);

// router.post("/followed", UsersController.userfollowed);

// router.delete("/followed", UsersController.userUnfollow);

router.post("/login", UsersController.userLogin);

// router.post("/results/:userName", UsersController.userSearchByUserName);

module.exports = router;
