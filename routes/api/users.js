const express = require("express");

const { authenticate } = require("../../middleware");
const { users: ctrl } = require("../../controllers");
const router = express.Router();

router.get("/current", authenticate, ctrl.getCurrent);

module.exports = router;
