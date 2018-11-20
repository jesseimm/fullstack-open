const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

function badRequest(res, errorText) {
    return res.status(400).json({ error: errorText });
}

const getTokenFrom = (request) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7);
    }
    return null;
};

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user');
    response.json(blogs);
});

blogsRouter.get('/:id', async ({ params: { id } }, response) => {
    const blog = await Blog
        .findById(id)
        .populate('user');
    return blog
        ? response.json(blog)
        : response.status(404).json({ error: 'no such id' });
});

blogsRouter.post('/', async (request, response) => {
    const { body } = request;

    try {
        const { token } = request;
        const decodedToken = jwt.verify(token, process.env.SECRET);

        if (!token || !decodedToken.id) {
            return response.status(401)
                .json({ error: 'token missing or invalid' });
        }

        if (!body.title || !body.url || !body.userId) {
            return badRequest(response, 'mandatory parameter missing');
        }

        const user = await User.findById(body.userId);

        const likes = body.likes ? body.likes : 0;
        const blog = new Blog({ ...body, likes, user: user._id }); //eslint-disable-line
        const savedBlog = await blog
            .save();
        //    .populate('user');

        user.blogs = user.blogs.concat(savedBlog._id); //eslint-disable-line
        await user.save();

        return response.status(201).json(savedBlog);
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return response.status(401).json({ error: err.message });
        }

        console.log(err);
        return response.status(500).json({ error: 'something went wront' });
    }
});

blogsRouter.delete('/:id', async ({ params: { id }, token }, response) => {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const blog = await Blog.findById(id);
    if (blog.user.toString() !== decodedToken.id.toString()) {
        return response.status(401).json({ error: 'soosoo' });
    }

    await Blog.findByIdAndRemove(id);
    return response.status(204).end();
});

blogsRouter.put('/:id', async ({ body, params: { id } }, response) => {
    const {
        title, author, url, likes,
    } = body;

    if (!title || !author || !url || !likes) {
        return badRequest(response, 'field missing');
    }

    const blog = {
        title, author, url, likes,
    };

    try {
        const updatedPerson = await Blog
            .findByIdAndUpdate(id, blog, { new: true })
            .populate('user');
        return response.json(updatedPerson);
    } catch (err) {
        console.log(err);
        return response.status(400).send('malformatted id');
    }
});

module.exports = blogsRouter;
