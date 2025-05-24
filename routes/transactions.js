const express = require('express');
const router = express.Router();
const {
  getAllTransactionsHandler,
  createTransactionHandler,
  getDetailTransactionByIdHandler,
  updateTransactionHandler,
  deleteTransactionHandler
} = require('../controllers/TransactionController');
const verifyToken = require('../middleware/auth')

router.get('/', verifyToken, getAllTransactionsHandler);
router.post('/:categoryId', verifyToken, createTransactionHandler);
router.get('/:id', verifyToken, getDetailTransactionByIdHandler);
router.put('/:id', verifyToken, updateTransactionHandler);
router.delete('/:id', verifyToken, deleteTransactionHandler);

module.exports = router;