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
    res.status(200).json({
      success: true,
      data: user,
    });
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

    sendTokenResponse(user, 201, res);
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

    sendTokenResponse(user, 200, res);
  })
);

// @desc    User logout
// @route   POST /api/users/logout
// @access  Private
router.post(
  '/logout',
  asyncHandler(async (req, res, next) => {
    // to do
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  })
);

// get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + 15 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.status(statusCode).cookie('access_token', token, options).json({
    success: true,
    token,
  });
};

module.exports = router;
