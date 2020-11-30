const http = require('http');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const notesRouter = require('./controllers/blogs.js');
const cors = require('cors');
require('dotenv').config();


const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch(() => console.log("Error connecting to MongoDB"))

app.use(cors())
app.use(express.json())

app.use('/api/blogs', notesRouter);

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})