const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/users.js');

usersRouter.post('/', async (req, res, next) => {
  const body = req.body;
  if (body.password.length <= 3) {
    const err = new Error('Password must be more than 3 characters.');
    err.status = 400;
    next(err);
  }

  const saltRounds = 14;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);
  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  });
  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

usersRouter.get('/', async (req, res) => {
  const userList = await User
    .find({})
    .populate('blogs');
  res.status(200).json(userList);
});

module.exports = usersRouter;