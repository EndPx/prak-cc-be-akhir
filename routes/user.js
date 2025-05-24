const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  loginHandler,
  registerHandler,
  editProfileUserHandler,
  deleteUserHandler
} = require('../controllers/UserController')

router.post('/login', loginHandler);
router.post('/register', registerHandler);
router.put('/', verifyToken, editProfileUserHandler);
router.delete('/', verifyToken, deleteUserHandler);

module.exports = router;