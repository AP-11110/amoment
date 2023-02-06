const express = require('express');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

const router = express.Router();

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
router.get(
  '/me',
  asyncHandler(async (req, res, next) => {
    const user = req.user;
    res.send(user);
  })
);

// @desc    User Registration
// @route   POST /api/users/register
// @access  Public
router.post(
  '/register',
  asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    // create user
    const user = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json(user);
  })
);

// @desc    User login
// @route   POST /api/users/login
// @access  Public
router.post(
  '/login',
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // validates email & password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    // check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    res.status(200).json(user);
  })
);

// @desc    User logout
// @route   POST /api/users/logout
// @access  Private
router.post(
  '/logout',
  asyncHandler(async (req, res, next) => {
    // to do
    res.send('Yooooo');
  })
);

module.exports = router;
