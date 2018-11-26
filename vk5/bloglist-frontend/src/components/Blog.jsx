import React from 'react';
import blogService from '../services/blogs';

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      {blog.title}
      {' '}
      {blog.author}
      <button
        type="button"
        onClick={() => { blogService.update({ ...blog, likes: blog.likes + 1 }); }}
      >
        Likes: {blog.likes} +Like
      </button>
    </div>
  );
};


export default Blog;
