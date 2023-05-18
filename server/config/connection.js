import pkg from 'mongoose';
const { connect, connection } = pkg;

connect('mongodb://localhost/exceed-game', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default connection;