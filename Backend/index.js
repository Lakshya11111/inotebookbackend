const connecToMongo = require("./db");
const express = require('express');
var cors = require('cors');
const dotenv = require('dotenv').config()

connecToMongo();

const app = express();
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });
const port = process.env.port || 5000;

app.use(cors())
app.use(express.json())

//Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`iNotebook listening at http://localhost:${port}`);
});
