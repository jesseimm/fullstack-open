const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

function badRequest(res, errorText) {
    return res.status(400).json({ error: errorText });
}

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

blogsRouter.post('/', async ({ body }, response) => {
    try {
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
        console.log(err);
        return response.status(500).json({ error: 'something went wront' });
    }
});

blogsRouter.delete('/:id', async ({ params: { id } }, response) => {
    await Blog.findByIdAndRemove(id);
    response.status(204).end();
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
