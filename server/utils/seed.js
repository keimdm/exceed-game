import pkg from 'mongoose';
const { connect, connection } = pkg;
import models from '../models/index.js';

connect('mongodb://localhost/exceed-game', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(
  () => { 
    console.log("connection file ready");
    seedData();
  },
  err => { console.err("error") }
);

connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

const seedData  = async () => {
  console.log("database is open");
  await models.User.deleteMany({});

  // sample seed data for users

  const users = [
    {
        username: "Test One",
        email: "test1@test.com",
        password: "password"
    },
    {
        username: "Test Two",
        email: "test2@test.com",
        password: "password"
    },
    {
        username: "Test Three",
        email: "test3@test.com",
        password: "password"
    },
  ];

  await models.User.collection.insertMany(users);

  console.table(users);
  process.exit(0);
};
