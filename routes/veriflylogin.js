const express = require('express');
const router = express.Router();
const loginController = require('../controller/loginController');


router.post("/" , loginController.veriflyToken);

module.exports = router;