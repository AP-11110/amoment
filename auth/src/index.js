const mongoose = require('mongoose');
const app = require('./server');

// if (!process.env.JWT_KEY) {
//   throw new Error('JWT must be defined');
// }
// if (!process.env.MONGO_URI) {
//   throw new Error('MONGO_URI must be defined');
// }

// connecting to mongodb and starting the server
mongoose
  .connect('mongodb://auth-mongo-srv:27017/auth')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server has started!');
    });
  })
  .catch((err) => console.error(err));
