const express = require("express");

const { authenticate } = require("../../middleware");
const { contacts: ctrl } = require("../../controllers");
const router = express.Router();

router.get("/", authenticate, ctrl.getAll);
router.get("/:contactId", authenticate, ctrl.getById);
router.post("/", authenticate, ctrl.add);
router.put("/:contactId", authenticate, ctrl.updateById);
router.patch("/:contactId", authenticate, ctrl.updateStatusContact);
router.delete("/:contactId", authenticate, ctrl.removeById);

module.exports = router;
