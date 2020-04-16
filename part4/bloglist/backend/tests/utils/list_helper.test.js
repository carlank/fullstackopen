const listHelper = require('../../utils/list_helper.js');

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

const listWithOneBlog = [{
  _id: '5a422aa71b54a676234d17f8',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
  __v: 0
}];

const listWithFiveBlogs = [{
  _id: '5a422aa71b54a676234d17f8',
  title: 'How to Read Blogs',
  author: 'Frank Peters',
  url: 'http://goober.com/blog.html',
  likes: 5,
  __v: 0
}, {
  _id: '5a422aa71b54a676234d17f7',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 6,
  __v: 0
}, {
  _id: '5a422aa71b54a676234d17f6',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 7,
  __v: 0
}, {
  _id: '5a422aa71b54a676234d17f5',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 8,
  __v: 0
}, {
  _id: '5a422aa71b54a676234d17f4',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 9,
  __v: 0
}, ];

describe('totalLikes', () => {
  test('of empty list equals zero', () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test('of single blog equals likes of that blog', () => {
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(5);
  });

  test('of multiple blogs, equals sum of likes', () => {
    expect(listHelper.totalLikes(listWithFiveBlogs)).toBe(35);
  });
});

describe('favoriteBlog', () => {
  test('of empty list equals null', () => {
    expect(listHelper.favoriteBlog([])).toBe(null);
  });

  test('of single blog equals blog', () => {
    expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(listWithOneBlog[0]);
  });

  test('of multiple blogs, equals blog with most likes', () => {
    expect(listHelper.favoriteBlog(listWithFiveBlogs)).toEqual(listWithFiveBlogs[4]);
  });
});

describe('mostBlogs', () => {
  test('of empty list equals null', () => {
    expect(listHelper.mostBlogs([])).toBe(null);
  });

  test('of single blog returns {author: [name], blogs: 1}', () => {
    expect(listHelper.mostBlogs(listWithOneBlog)).toEqual({author: 'Edsger W. Dijkstra', blogs: 1});
  });

  test('of multiple blogs, returns correct answer', () => {
    expect(listHelper.mostBlogs(listWithFiveBlogs)).toEqual({author: 'Edsger W. Dijkstra', blogs: 4});
  });
});

describe('mostLikes', () => {
  test('of empty list equals null', () => {
    expect(listHelper.mostLikes([])).toBe(null);
  });

  test('of single blog returns {author: [name], likes: [likes]}', () => {
    expect(listHelper.mostLikes(listWithOneBlog)).toEqual({author: 'Edsger W. Dijkstra', likes: 5});
  });

  test('of multiple blogs, returns correct answer', () => {
    expect(listHelper.mostLikes(listWithFiveBlogs)).toEqual({author: 'Edsger W. Dijkstra', likes: 30});
  });
});