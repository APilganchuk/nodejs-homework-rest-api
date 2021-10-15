const express = require("express");

const { auth: ctrl } = require("../../controllers");
const router = express.Router();

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("logout", ctrl.logout);

module.exports = router;
