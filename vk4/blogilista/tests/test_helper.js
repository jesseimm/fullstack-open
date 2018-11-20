const Blog = require('../models/blog');
const User = require('../models/user');

const contentTypes = {
    key: 'Content-Type',
    json: /application\/json/,
};

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

const format = blog => ({
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    id: blog._id, //eslint-disable-line
});

const nonExistingId = async () => {
    const blog = new Blog();
    await blog.save();
    await blog.remove();

    return blog._id.toString(); //eslint-disable-line
};

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(format);
};

const usersInDb = async () => {
    const users = await User.find({});
    return users;
};

module.exports = {
    initialBlogs, format, nonExistingId, blogsInDb, contentTypes, usersInDb,
};
