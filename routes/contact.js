const express = require('express');
const router = express.Router();
const contactController = require('../controller/contactMsgController');

router.post("/msg" , contactController.contactAdd);
router.get("/all" , contactController.msgAll);

module.exports = router;