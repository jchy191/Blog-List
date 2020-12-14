const testRouter = require('express').Router();
const Blog = require('../models/blogs');
const User = require('../models/users');

testRouter.post('/reset', (req, res) => {
  Blog.deleteMany({});
  User.deleteMany({});
  res.status(204).end();
});

module.exports = testRouter;