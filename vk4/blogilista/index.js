const http = require('http');
const express = require('express');

const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const { loginRouter } = require('./controllers/login');
const { tokenExtractor } = require('./utils/middlewares');
const morgan = require('morgan');

mongoose
    .connect(config.mongoUrl)
    .then(() => {
        console.log('Connected to database', config.mongoUrl);
    })
    .catch(console.log);

app.use(cors());
app.use(bodyParser.json());
morgan.token('body', req => JSON.stringify(req.body));
const loggerFormat = ':method :url :body :status :response-time';
app.use(morgan(loggerFormat, {
    stream: process.stdout,
}));


app.use(tokenExtractor);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

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
