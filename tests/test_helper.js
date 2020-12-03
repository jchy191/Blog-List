const Blog = require('../models/blogs.js');
const Users = require('../models/users.js');

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

const nonExistingId = async () => {
  const note = new Blog({ title: 'willremovethissoon', author: 'test', url: 'test' });
  await note.save();
  await note.remove();

  return note._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
  const users = await Users.find({});
  return users.map(user => user.toJSON());
};

module.exports = {
  initialPosts,
  nonExistingId,
  blogsInDb,
  usersInDb
};