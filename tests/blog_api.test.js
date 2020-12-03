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

describe('When there are initially some blogs saved', () => {
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
});

describe('Viewing a specific blog post', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView));
    expect(resultBlog.body).toEqual(processedBlogToView);
  });

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId();
    await api
      .get(`/api/blogs/${validNonExistingId}`)
      .expect(404)
      .expect('Content-Type', /application\/json/)
      .expect({ 'error': 'Blog does not exist' });
  });

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '1343jnaf23rdafj3';
    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400);
  });

});


describe('Addition of a new blog post', () => {
  test('succeeds with valid data', async () => {
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

  test('defaults to zero likes if none are specified', async () => {
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

  test('fails if title is not included', async () => {
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

  test('fails if URL is not included', async () => {
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
});

afterAll(() => {
  mongoose.connection.close();
});