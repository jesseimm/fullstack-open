const dummy = () => 1;

const totalLikes = (blogs) => {
    const reducer = (acc, blog) => acc + blog.likes;
    return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
    const reducer = (acc, blog) => {
        if (!acc.likes) return blog;
        return (blog.likes > acc.likes ? blog : acc);
    };
    return blogs.reduce(reducer, {});
};

const getHighest = nameAmountObj => Object.entries(nameAmountObj)
    .reduce((acc, [name, amount]) => ((acc && acc.amount > amount)
        ? acc
        : { author: name, amount }), {});

const mostBlogs = (blogs) => {
    const reduceToAuthAmountPairs = (acc, { author }) => {
        const incrementedValue = acc[author] ? acc[author] + 1 : 1;
        return {
            ...acc,
            [author]: incrementedValue,
        };
    };

    const pairs = blogs.reduce(reduceToAuthAmountPairs, {});
    return getHighest(pairs);
};

const mostLikes = (blogs) => {
    const reduceToAuthLikesPairs = (acc, { author, likes }) => {
        const incrementedValue = acc[author] ? acc[author] + likes : likes;
        return {
            ...acc,
            [author]: incrementedValue,
        };
    };

    const pairs = blogs.reduce(reduceToAuthLikesPairs, {});
    return getHighest(pairs);
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
};
