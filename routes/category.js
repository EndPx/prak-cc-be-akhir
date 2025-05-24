const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth')
const {
    getAllCategoriesHandler,
    createCategoryHandler,
    deleteCategoryHandler
} = require('../controllers/CategoryController');

router.get('/', verifyToken, getAllCategoriesHandler);
router.post('/', verifyToken, createCategoryHandler);
router.delete('/:id', verifyToken, deleteCategoryHandler);

module.exports = router;