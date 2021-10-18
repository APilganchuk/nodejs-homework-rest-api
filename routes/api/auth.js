const express = require("express");

const { authenticate } = require("../../middleware");
const { auth: ctrl } = require("../../controllers");
const router = express.Router();

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/logout", authenticate, ctrl.logout);

module.exports = router;
