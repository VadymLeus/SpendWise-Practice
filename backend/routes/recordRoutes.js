const express = require("express");
const router = express.Router();
const {addRecordController, getRecordsController, updateRecordController,deleteRecordController} = require("../controllers/recordController");

router.get("/:id", getRecordsController);
router.post("/", addRecordController);
router.put("/", updateRecordController);
router.delete("/", deleteRecordController);

module.exports = router;
