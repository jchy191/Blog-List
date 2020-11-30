const Blog = require('../models/blogs.js');
const blogsRouter = require('express').Router();
require('express-async-errors');

blogsRouter.get('/', async (req, res) => {
  const blogList = await Blog.find({});
  res.json(blogList);
});

blogsRouter.post('/', async (req, res) => {
  if (!req.body.likes) {
    req.body.likes = 0;
  }

  if (!req.body.title || !req.body.url) {
    return res.status(400).json({ error: 'Missing information' });
  }
  const blog = new Blog(req.body);

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});

module.exports = blogsRouter;