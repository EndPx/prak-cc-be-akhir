const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {getDashboardHandler} = require('../controllers/DashboardController')

router.get('/', verifyToken, getDashboardHandler);

module.exports = router;