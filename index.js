// require express
const express = require('express');

// create express app
const app = express();

// require mongoose
const mongoose = require('mongoose');

// require doten
const dotenv = require('dotenv');
dotenv.config();

//  routes
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((err) => {
    console.log(err);
  });

//
app.use(express.json());

//   middleware
app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);

app.listen(process.env.PORT || 8080, () => {
  console.log('server is running');
});
