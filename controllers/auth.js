const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

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
    // find user by email
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
    }
    // decrypt password
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET
    );
    const OriginalPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);

    // compare password
    if (OriginalPassword !== req.body.password) {
      res.status(401).json({ message: 'Invalid email or password' });
    }
    // generate token
    const accesstoken = jwt.sign(
      {
        _id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // hide password
    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accesstoken }),
      {
        message: 'Logged in successfully',
        user: user,
      };

    // // generate token
    // const token = user.generateAuthToken();
    // res.status(200).json({
    //   token,
    //   user: {
    //     _id: user._id,
    //     username: user.username,
    //     email: user.email,
    //   },
    // });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  register,
  login,
};
