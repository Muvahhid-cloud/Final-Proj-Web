const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const ctrl = require("../controllers/user.controller");


const role = require("../middleware/role.middleware");

router.get("/profile", auth, ctrl.getProfile);
router.put("/profile", auth, ctrl.updateProfile);
router.put("/password", auth, ctrl.updatePassword);

// Example: Only admin can get all users
router.get("/", auth, role("admin"), ctrl.getAllUsers);
router.delete("/:id", auth, role("admin"), ctrl.deleteUser);
router.get("/:id/orders", auth, role("admin"), ctrl.getUserOrders);

module.exports = router;