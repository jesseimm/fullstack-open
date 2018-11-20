const supertest = require('supertest');
const { app, server } = require('../index');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: `http://www.u.arizona.edu/~rubinson/
              copyright_violations/Go_To_Considered_Harmful.html`,
        likes: 6,
    },
    {
        title: 'Jepsis',
        author: 'Mahjong',
        url: 'mahjong.com',
        likes: 5,
    },
];

const newBlog = {
    title: 'Promisen kirous',
    author: 'Tarvalds',
    url: 'tarvälds.com',
    likes: 2,
};

const blogsUri = '/api/blogs/';

beforeAll(async () => {
    await Blog.remove({});

    const blogObjects = initialBlogs.map(blog => new Blog(blog));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray);
});

describe('GET: ', () => {
    test('blog posts are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('there are two blog posts', async () => {
        const response = await api
            .get('/api/blogs');

        expect(response.body.length).toBe(2);
    });
});

describe('POST: ', () => {
    test('a valid blog post can be added', async () => {
        await api
            .post(blogsUri)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const response = await api.get(blogsUri);
        expect(response.body.length).toBe(initialBlogs.length + 1);
    });

    test('blog without title should not be added', async () => {
        const initial = await api.get(blogsUri);

        await api
            .post(blogsUri)
            .send({ author: 'a', url: 'b', likes: 9001 })
            .expect(400);

        const response = await api.get(blogsUri);
        expect(response.body.length).toBe(initial.body.length);
    });

    test('if no likes is sent a new post should have zero likes', async () => {
        const { title, author, url } = newBlog;
        const resp = await api
            .post(blogsUri)
            .send({ title, author, url })
            .expect(201)
            .expect('Content-Type', /application\/json/);

        expect(resp.body.likes).toBe(0);
    });
});

afterAll(() => {
    server.close();
});
