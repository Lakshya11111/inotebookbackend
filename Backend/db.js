const mongoose = require('mongoose');
const dotenv = require('dotenv').config()

const connecToMongo = () => {
  mongoose.connect( process.env.Database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));
}
// const connecToMongo = ()=>{
// mongoose.connect('mongodb://127.0.0.1/inotebook', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Could not connect to MongoDB', err));
// }

module.exports = connecToMongo;