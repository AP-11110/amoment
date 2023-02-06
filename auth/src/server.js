const express = require('express');
const errorHandler = require('./middleware/error');
const auth = require('./routes/auth');

const app = express();

// middlewares
app.use(express.json());

app.use('/api/users', auth);

app.use(errorHandler);

module.exports = app;
