const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url =
  `mongodb+srv://fullstack:${password}@cluster0-nqjlx.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

switch (process.argv.length) {
  case 3:
    Person.find({}).then(res => {
      res.forEach(person => {
        console.log(person);
      });
      mongoose.connection.close();
    });
    break;
  case 4:
    Person.find({ name: process.argv[3] }).then(res => {
      console.log(res[0]);
      mongoose.connection.close();
    });
    break;
  case 5:
    new Person({
      name: process.argv[3],
      number: process.argv[4],
    }).save().then(response => {
      console.log(`added ${response.name} ${response.number} to phonebook`);
      mongoose.connection.close();
    });
    break;
}