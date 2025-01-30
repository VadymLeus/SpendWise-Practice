const express = require("express");
const router = express.Router();
const { getUserProfile, changePassword, changeEmail, deleteAccount } = require("../controllers/profileController");

router.get("/:userId", getUserProfile);
router.post("/change-password", changePassword);
router.post("/change-email", changeEmail);
router.delete("/:userId", deleteAccount);

module.exports = router;