const bcrypt = require('bcryptjs');

const hash = (pass) => bcrypt.hashSync(pass, 10);

const generateId = () => require('mongoose').Types.ObjectId();

const initialUsers = [
  {
    username: 'root',
    name: 'Enoch Root',
    passwordHash: hash('thefallofseveneves'),
    _id: generateId(),
  },
  {
    username: 'nsullivanfriedman',
    name: 'Nicholas Sullivan-Friedman',
    passwordHash: hash('passwordgoeshere'),
    _id: generateId(),
  }
];

const initialBlogs = [{
  author: 'Franklin Roosevelt',
  title: 'Why Tomatoes Are Vegetables',
  user: initialUsers[0]._id,
  likes: 1,
  _id: generateId(),
},
{
  author: 'Kevin Kowalski',
  title: 'Tomatoes Are The Best Fruit',
  user: initialUsers[0]._id,
  likes: 10,
  _id: generateId(),
},
{
  author: 'Peter Parker',
  title: 'How to Be a SuperHero',
  user: initialUsers[1]._id,
  likes: 12,
  _id: generateId(),
}
];

initialUsers[0].blogs = [initialBlogs[0]._id, initialBlogs[1]._id];
initialUsers[1].blogs = [initialBlogs[2]._id];

module.exports = {
  initialBlogs,
  initialUsers
};