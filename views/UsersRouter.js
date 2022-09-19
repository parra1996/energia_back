const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/UsersController");
const auth = require("../middlewares/auth");


router.post("/", UsersController.userRegister);

router.get("/", auth, UsersController.allUser);

router.delete("/", auth,UsersController.userDelete);

router.put("/", auth,UsersController.userUpdate);

router.post('/atrapar', auth, UsersController.atrapar)

router.delete('/liberar', UsersController.liberar)

router.post('/mostrar/:_id', UsersController.mostrar)

router.post("/login", UsersController.userLogin);

module.exports = router;
