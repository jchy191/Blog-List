const Blog = require('../models/blogs.js');

const initialPosts = [
  {
    title: 'Singing in the rain',
    author: 'Joshua',
    url: 'www.singingintherain.com',
    likes: 30
  },
  {
    title: 'I am happy today',
    author: 'Isaac',
    url: 'www.simpsons.com',
    likes: 134
  },
  {
    title: 'Hello World',
    author: 'Jacob',
    url: 'www.abcde.com',
    likes: 53
  },
  {
    title: 'An Apple A Day',
    author: 'Sarah',
    url: 'www.pears.com',
    likes: 84
  }
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

module.exports = {
  initialPosts,
  blogsInDb
};