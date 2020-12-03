const mongoose = require('mongoose');
const express = require('express');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const app = express();
const notesRouter = require('./controllers/blogs.js');
const usersRouter = require('./controllers/users.js');
const cors = require('cors');
require('dotenv').config();


const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('Successfully connected to MongoDB');
  })
  .catch(() => logger.error('Error connecting to MongoDB'));

app.use(middleware.requestLogger);

app.use(cors());
app.use(express.json());

app.use('/api/blogs', notesRouter);
app.use('/api/users', usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

