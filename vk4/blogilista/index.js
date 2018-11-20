const http = require('http');
const express = require('express');

const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');

mongoose
    .connect(config.mongoUrl)
    .then(() => {
        console.log('Connected to database', config.mongoUrl);
    })
    .catch(console.log);

app.use(cors());
app.use(bodyParser.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

const server = http.createServer(app);

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});

server.on('close', () => {
    mongoose.connection.close();
});

module.exports = {
    app, server,
};
