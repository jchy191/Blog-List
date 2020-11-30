const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blogs.js');
const helper = require('./test_helper.js');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  for (let blog of helper.initialPosts) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test('Blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('Blogs are returned with unique identifier named id', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body[0].id).toBeDefined();
  expect(response.body[0]._id).not.toBeDefined();
});

test('A valid post can be added', async () => {
  const newPost = {
    author: 'Matthew',
    title: 'He is King',
    url: 'www.genealogy.com',
    likes: 39,
  };
  await api
    .post('/api/blogs')
    .send(newPost)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialPosts.length + 1);

  const titles = blogsAtEnd.map(blog => blog.title);
  expect(titles).toContain('He is King');
});

test('Blog without likes defaults to zero likes', async () => {
  const newPost = {
    author: 'Matthew',
    title: 'He is King',
    url: 'www.genealogy.com',
  };
  await api
    .post('/api/blogs')
    .send(newPost)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0);
});

test('Blog without title is not added', async () => {
  const newPost = {
    author: 'Matthew',
    url: 'www.genealogy.com',
    likes: 92
  };
  await api
    .post('/api/blogs')
    .send(newPost)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialPosts.length);
});

test('Blog without url is not added', async () => {
  const newPost = {
    author: 'Matthew',
    title: 'He is King',
    likes: 92
  };
  await api
    .post('/api/blogs')
    .send(newPost)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialPosts.length);
});


afterAll(() => {
  mongoose.connection.close();
});