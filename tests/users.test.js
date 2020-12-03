const bcrypt = require('bcrypt');
const supertest = require('supertest');
const app = require('../app.js');
const User = require('../models/users.js');
const helper = require('./test_helper');
const mongoose = require('mongoose');
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('secret', 14);
  const user = new User({ username: 'root', name: 'root user', passwordHash, blogs: [] });
  await user.save();
});

afterAll(() => {
  mongoose.connection.close();
});

describe('Adding a new user', () => {
  test('succeeds with valid data and unique username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'jjjchin',
      name: 'Joshua',
      password: 'asdjfkdj'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(user => user.username);
    expect(usernames).toContain(newUser.username);
  });
});