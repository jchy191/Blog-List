const Blog = require('../models/blogs.js');
const User = require('../models/users');
const middleware = require('../utils/middleware');
const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
require('express-async-errors');



blogsRouter.get('/', async (req, res) => {
  const blogList = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 });
  res.json(blogList);
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog
    .findById(req.params.id)
    .populate('user', { username: 1, name: 1, id: 1 });
  if (blog) {
    res.status(200).json(blog);
  } else {
    return res.status(404).json({ error: 'Blog does not exist' });
  }
});

blogsRouter.post('/', middleware.tokenExtractor, async (req, res, next) => {
  const body = req.body;

  if (!body.likes) {
    body.likes = 0;
  }

  if (!body.title || !body.url) {
    const err = new Error('Missing information');
    err.status = 400;
    return next(err);
  }

  const user = await User.findById(req.decodedToken.id);
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    date: new Date(),
    likes: body.likes,
    user: user._id
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (req, res) => {
  if (!req.body.title || !req.body.url) {
    return res.status(400).json({ error: 'Missing information' });
  }
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json(updatedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = blogsRouter;