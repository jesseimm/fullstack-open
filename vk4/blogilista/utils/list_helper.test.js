const listHelper = require('../utils/list_helper');


const djikstra = {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 6,
    __v: 0,
};

const djikstra2 = {
    _id: '5a422aa71b54a676234d1710',
    title: 'Jeejee',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/jeejee.html',
    likes: 10,
    __v: 0,
};

const mahjong = {
    _id: '5a422aa71b54a676234d17f9',
    title: 'Jepsis',
    author: 'Mahjong',
    url: 'mahjong.com',
    likes: 5,
    __v: 0,
};

const listWithOneBlog = [djikstra];
const listWithTwoBlog = listWithOneBlog.concat([mahjong]);
const listWithThreeBlogs = listWithTwoBlog.concat([djikstra2]);

test('dummy is called', () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
});

describe('totalLikes', () => {
    test('sum of one blogs likes', () => {
        const result = listHelper.totalLikes(listWithOneBlog);
        expect(result).toBe(6);
    });

    test('sum of two blogs likes', () => {
        const result = listHelper.totalLikes(listWithTwoBlog);
        expect(result).toBe(11);
    });

    test('sum of zero blogs likes', () => {
        const result = listHelper.totalLikes([]);
        expect(result).toBe(0);
    });
});

describe('favoriteBlog', () => {
    test('returns blog with highest likes from array of two', () => {
        const result = listHelper.favoriteBlog(listWithTwoBlog);
        expect(result).toEqual(djikstra);
    });

    test('returns an empty object when there is no blogs', () => {
        const result = listHelper.favoriteBlog([]);
        expect(result).toEqual({});
    });
});

describe('mostBlogs', () => {
    test('returns author who has most blogs', () => {
        const result = listHelper.mostBlogs(listWithThreeBlogs);
        const expected = { author: djikstra.author, amount: 2 };
        expect(result).toEqual(expected);
    });

    test('returns an empty object for an empty array', () => {
        const result = listHelper.mostBlogs([]);
        expect(result).toEqual({});
    });
});

describe('mostLikes', () => {
    test('returns author who has most likes', () => {
        const result = listHelper.mostLikes(listWithThreeBlogs);
        const expected = { author: djikstra.author, amount: 16 };
        expect(result).toEqual(expected);
    });

    test('returns an empty object for an empty array', () => {
        const result = listHelper.mostLikes([]);
        expect(result).toEqual({});
    });
});
