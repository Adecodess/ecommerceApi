const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const nodemailer = require('../middleware/nodemailer');

// register new user
const register = async (req, res) => {
  //   create new user
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,

    // encrypt password
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString(),
  });
  try {
    // save user to database
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

// login user

const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(404).json('User not found');

    // encrypt password
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    // check if password is correct
    originalPassword !== req.body.password &&
      res.status(401).json('Wrong Credentials');

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,

      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    const { password, ...others } = user._doc;

    res.status(200).json({ others, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
};

// const verifyUser = async (req, res, next) => {
//   try {
//     const user = await User.findOne({
//       confirmationCode: req.params.confirmationCode,
//     });
//     !user && res.status(404).json('User not found');
//     user.status = 'Active';
//     // user.confirmationCode = '';

//     const savedUser = await user.save();

//     res.status(200).json(savedUser);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

module.exports = {
  register,
  login,
};
