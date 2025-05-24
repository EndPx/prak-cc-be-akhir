const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const transactionRoutes = require('./transactions');
const categoryRoutes = require('./category');
const dashboardRoutes = require('./dashboard');

router.use('/user', userRoutes);
router.use('/transaction', transactionRoutes);
router.use('/category', categoryRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;