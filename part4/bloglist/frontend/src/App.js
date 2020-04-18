import React, { useState, useEffect } from 'react';
import Blog from './components/Blog.js';
import UserCard from './components/UserCard.js';
import blogService from './services/blogs.js';

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    );  
  }, []);

  return (
    <div>
      <h1>Blogs Registry</h1>
      <UserCard loggedIn={user!==null}/>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  );
};

export default App;