const Blog = require('../models/blogs.js');
const blogsRouter = require('express').Router();
require('express-async-errors');

blogsRouter.get('/', async (req, res) => {
  const blogList = await Blog.find({});
  res.json(blogList);
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    res.status(200).json(blog);
  } else {
    return res.status(404).json({ error: 'Blog does not exist' });
  }
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

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = blogsRouter;