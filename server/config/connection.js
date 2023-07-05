import pkg from 'mongoose';
const { connect, connection } = pkg;

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/exceed-game';

connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(
  () => { console.log("connection file ready") },
  err => { console.err("error") }
);

export default connection;