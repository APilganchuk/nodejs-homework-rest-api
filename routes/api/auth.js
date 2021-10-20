const express = require("express");

const { authenticate } = require("../../middleware");
const { auth: ctrl } = require("../../controllers");
const router = express.Router();

router.post("/register", ctrl.register);
// /signup
router.post("/login", ctrl.login);
// /signin
router.get("/logout", authenticate, ctrl.logout);
// /signout

module.exports = router;
