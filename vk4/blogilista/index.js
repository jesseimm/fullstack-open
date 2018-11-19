const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');

if (process.env.NODE_END !== 'production') {
     require('dotenv').config(); //eslint-disable-line
}

if (!process.env.MONGO_STRING) throw new Error('No MONGO_STRING present in the system');

const mongoUrl = process.env.MONGO_STRING;
mongoose.connect(mongoUrl);

app.use(cors());
app.use(bodyParser.json());

app.use('/api/blogs', blogsRouter);

const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
