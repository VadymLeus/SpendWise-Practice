const express = require("express");
const router = express.Router();
const {registerUser, loginUser, getUser} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user/:id", getUser);

module.exports = router;
