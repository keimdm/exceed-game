import pkg from 'mongoose';
const { connect, connection } = pkg;

connect('mongodb://localhost:27017/exceed-game', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default connection;