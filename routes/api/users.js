const express = require("express");

const { authenticate, upload } = require("../../middleware");
const { users: ctrl } = require("../../controllers");
const router = express.Router();

router.get("/current", authenticate, ctrl.getCurrent);
router.patch("/current", authenticate, ctrl.updateSubscription);

router.patch("/avatars", authenticate, upload.single('avatar'), ctrl.updateAvatar);

router.get("/verify/:verifyToken", ctrl.verify);

module.exports = router;
