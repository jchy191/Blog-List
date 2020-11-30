const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((totalLikes, blog) => totalLikes += blog.likes, 0);
};

const favouriteBlog = (blogs) => {
  const blogWithMostLikes = blogs.reduce((favouriteBlog, currentBlog) => favouriteBlog.likes > currentBlog.likes ? favouriteBlog : currentBlog, {});
  return {
    title: blogWithMostLikes.title,
    author: blogWithMostLikes.author,
    likes: blogWithMostLikes.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  const blogCount = _.countBy(blogs, 'author');

  let authorWithMostBlogs;
  let numberOfBlogs = 0;
  for (let author in blogCount) {
    if (blogCount[author] > numberOfBlogs) {
      authorWithMostBlogs = author;
      numberOfBlogs = blogCount[author];
    }
  }
  return {
    author: authorWithMostBlogs,
    blogs: numberOfBlogs,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs
};