const express = require('express');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const auth = require('./routes/auth');

const app = express();
app.set('trust proxy', true); // allows nginx

// body parser
app.use(express.json());
// cookie parser
app.use(cookieParser());

app.use('/api/users', auth);

app.use(errorHandler);

module.exports = app;
