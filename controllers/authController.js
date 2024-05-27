const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signup = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.Password, salt);
    const newUser = {
      userName: req.body.UserName,
      email: req.body.email,
      password: hash
    };
    await User.insertMany([newUser]);
    res.status(200).send({ userName: req.body.UserName, email: req.body.email });
  } catch (err) {
    res.send(err);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.body.UserName });
    if (!user) {
      return res.status(404).send("User Not Found");
    }
    const isCorrect = await bcrypt.compare(req.body.Password, user.password);
    if (!isCorrect) {
      return res.status(400).send("Incorrect Password");
    }
    const token = jwt.sign({ id: user._id }, "shiva$rama$krishna");
    const { password, ...otherDetails } = user._doc;
    res.cookie("access_token", token, {
      httpOnly: true,
    }).status(200).json(otherDetails);
  } catch (err) {
    res.status(500).send(err);
  }
};
