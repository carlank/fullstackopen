const _ = require('lodash');

const dummy = () => 1;

const totalLikes = (blogs) => blogs.reduce((a, e) => a + e.likes, 0);

const favoriteBlog = (blogs) => blogs.length ? blogs.reduce((a, e) => e.likes > a.likes ? e : a) : null;

const mostBlogs = (blogs) => blogs.length ?
  [Object.entries(_.mapValues(_.groupBy(blogs, 'author'), v => v.length)).sort((a,b)=>b[1] - a[1])[0]]
    .reduce((_,e) => ({author: e[0], blogs: e[1]}),null)
  : null;

const mostLikes = (blogs) => blogs.length ?
  [Object.entries(_.mapValues(_.groupBy(blogs, 'author'), v => v.reduce((a,e)=>a+e.likes,0))).sort((a,b)=>b[1] - a[1])[0]]
    .reduce((_,e) => ({author: e[0], likes: e[1]}),null)
  : null;

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};