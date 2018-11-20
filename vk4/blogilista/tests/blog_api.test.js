const supertest = require('supertest');
const { app, server } = require('../index');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

const {
    initialBlogs, nonExistingId, blogsInDb, contentTypes, usersInDb,
} = require('./test_helper');

describe('BLOGS TESTS', () => {
    let user;
    let newBlog;

    const blogsUri = '/api/blogs/';


    beforeAll(async () => {
        await Blog.remove({});

        const blogObjects = initialBlogs.map(blog => new Blog(blog));
        await Promise.all(blogObjects.map(blog => blog.save()));
        const newUser = new User({ username: 'root', password: 'sekret' });
        user = await newUser.save();
        newBlog = {
            title: 'Promisen kirous',
            author: 'Tarvalds',
            url: 'tarvälds.com',
            likes: 2,
            userId: newUser._id, //eslint-disable-line
        };
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

        test('individual blogs are returned as json', async () => {
            const blogsInDatabase = await blogsInDb();
            const aBlog = blogsInDatabase[0];

            const response = await api
                .get(`${blogsUri}/${aBlog.id}`)
                .expect(200)
                .expect(contentTypes.key, contentTypes.json);

            expect(response.body.title).toContain(aBlog.title);
        });

        test('404 returned by GET nonexisting id', async () => {
            const validNonexistingId = await nonExistingId();

            await api
                .get(`${blogsUri}/${validNonexistingId}`)
                .expect(404);
        });
    });

    describe('POST: ', () => {
        test('a valid blog post can be added', async () => {
            const initial = await blogsInDb();
            await api
                .post(blogsUri)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const after = await blogsInDb();
            expect(after.length).toBe(initial.length + 1);
        });

        test('blog without title should not be added', async () => {
            const initial = await blogsInDb();
            const {
                author, url, likes,
            } = newBlog;
            const userId = newBlog.user;

            await api
                .post(blogsUri)
                .send({
                    author, url, likes, userId,
                })
                .expect(400);

            const after = await blogsInDb();
            expect(after.length).toBe(initial.length);
        });

        test('if no likes, a new post should have 0 likes', async () => {
            const {
                title, author, url, userId,
            } = newBlog;

            const resp = await api
                .post(blogsUri)
                .send({
                    title, author, url, userId,
                })
                .expect(201)
                .expect('Content-Type', /application\/json/);

            expect(resp.body.likes).toBe(0);
        });
    });

    describe('DELETE: ', () => {
        test('deleting existing blog works', async () => {
            const initial = await blogsInDb();
            const blog = initial[0];

            await api
                .delete(`${blogsUri}/${blog.id}`)
                .expect(204);

            const after = await blogsInDb();
            const titles = after.map(b => b.title);

            expect(titles).not.toContain(blog.title);
        });
    });

    describe('PUT: ', () => {
        test('changing blog title works', async () => {
            const initial = await blogsInDb();
            const originalBlog = initial[0];
            const changedBlog = {
                ...originalBlog,
                title: 'changedTitle',
            };

            await api
                .put(`${blogsUri}/${originalBlog.id}`)
                .send(changedBlog)
                .expect(200)
                .expect(contentTypes.key, contentTypes.json);

            const after = await blogsInDb();
            const titles = after.map(b => b.title);
            expect(initial.length).toBe(after.length);
            expect(titles).toContain(changedBlog.title);
            expect(titles).not.toContain(originalBlog.title);
        });
    });
});

describe('USER TESTS', () => {
    describe('when there is initially one user at db', async () => {
        beforeAll(async () => {
            await User.remove({});
            const user = new User({ username: 'root', password: 'sekret' });
            await user.save();
        });

        test('POST /api/users succeeds with a fresh username', async () => {
            const usersBeforeOperation = await usersInDb();

            const newUser = {
                username: 'mluukkai',
                name: 'Matti Luukkainen',
                adult: false,
                password: 'salainen',
            };

            await api
                .post('/api/users')
                .send(newUser)
                .expect(200)
                .expect('Content-Type', /application\/json/);

            const usersAfterOperation = await usersInDb();
            expect(usersAfterOperation.length)
                .toBe(usersBeforeOperation.length + 1);
            const usernames = usersAfterOperation.map(u => u.username);
            expect(usernames).toContain(newUser.username);
        });

        test('duplicate user should not be added', async () => {
            const usersBeforeOperation = await usersInDb();

            const newUser = {
                username: 'root',
                name: 'Superuser',
                adult: true,
                password: 'salainen',
            };

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/);

            expect(result.body).toEqual({ error: 'username must be unique' });

            const usersAfterOperation = await usersInDb();
            expect(usersAfterOperation.length)
                .toBe(usersBeforeOperation.length);
        });
    });
});

afterAll(() => {
    server.close();
});
