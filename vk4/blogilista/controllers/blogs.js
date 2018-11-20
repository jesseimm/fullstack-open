const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

blogsRouter.post('/', async ({ body }, response) => {
    if (!body.title || !body.url) {
        return response.status(400)
            .json({ error: 'mandatory parameter missing' });
    }

    const likes = body.likes ? body.likes : 0;
    const blog = new Blog({ ...body, likes });
    const savedBlog = await blog.save();
    return response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
