
const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// @route   GET api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', auth, admin, userController.getAllUsers);

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get('/:id', auth, admin, userController.getUserById);

// @route   POST api/users
// @desc    Create a user
// @access  Private/Admin
router.post('/', auth, admin, userController.createUser);

// @route   PUT api/users/:id
// @desc    Update a user
// @access  Private/Admin
router.put('/:id', auth, admin, userController.updateUser);

// @route   DELETE api/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/:id', auth, admin, userController.deleteUser);

module.exports = router;
