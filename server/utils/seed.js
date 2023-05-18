import pkg from 'mongoose';
const { connection } = pkg;
import User from '../models/index.js';

  connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  connection.once('open', async () => {
    await User.deleteMany({});

    // sample seed data for users

    const users = [
      {
          username: "Test One",
          email: "test1@test.com"
      },
      {
          username: "Test Two",
          email: "test2@test.com"
      },
      {
          username: "Test Three",
          email: "test3@test.com"
      },
    ];

    await User.collection.insertMany(users);

    console.table(users);
    process.exit(0);
  });
