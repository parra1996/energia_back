const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/UsersController");


router.post("/", UsersController.userRegister);

router.get("/", UsersController.allUser);

router.delete("/", UsersController.userDelete);

router.put("/", UsersController.userUpdate);

router.post('/atrapar', UsersController.atrapar)

router.delete('/liberar', UsersController.liberar)

router.post('/mostrar/:_id', UsersController.mostrar)

router.post("/login", UsersController.userLogin);

module.exports = router;
