const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

const getToken = (user) => {
    const userForToken = {
        username: user.username,
        id: user._id, //eslint-disable-line
    };

    return jwt.sign(userForToken, process.env.SECRET);
};

loginRouter.post('/', async ({ body }, response) => {
    const user = await User.findOne({ username: body.username });
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        return response.status(401)
            .json({ error: 'invalid username or password' });
    }

    const token = getToken(user);

    return response.status(200)
        .send({ token, username: user.username, name: user.name });
});

module.exports = {
    loginRouter,
    getToken,
};
