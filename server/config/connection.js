import pkg from 'mongoose';
const { connect, connection } = pkg;

connect('mongodb://127.0.0.1:27017/exceed-game', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(
  () => { console.log("connection file ready") },
  err => { console.err("error") }
);

export default connection;