const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const expiry = Number(process.env.JWT_EXPIRES_IN);

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
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({
        message: 'Auth failed',
      });
    }
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET
    );
    const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (Originalpassword !== req.body.password) {
      return res.status(401).json({
        message: 'Invalid password',
      });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: expiry,
      }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({
      message: 'Auth successful',
      accessToken,
      ...others,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  register,
  login,
};
