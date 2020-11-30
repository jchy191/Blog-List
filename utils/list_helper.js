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

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
};