const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
        .populate('blogs');
    response.json(users.map(User.format));
});

usersRouter.post('/', async ({ body }, response) => {
    try {
        if (body.password.length < 3) {
            return response.status(400)
                .json({ error: 'password exceed two charecters' });
        }
        const existingUser = await User
            .find({ username: body.username });
        if (existingUser.length > 0) {
            return response.status(400)
                .json({ error: 'username must be unique' });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(body.password, saltRounds);

        const user = new User({
            username: body.username,
            name: body.name,
            adult: !!body.adult,
            passwordHash,
        });

        const savedUser = await user.save();

        return response.json(User.format(savedUser));
    } catch (exception) {
        console.log(exception);
        return response.status(500).json({ error: 'something went wrong...' });
    }
});

module.exports = usersRouter;
