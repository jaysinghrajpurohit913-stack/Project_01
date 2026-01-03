const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/views');
require('dotenv').config();

const cookie = require('cookie-parser');
app.use(cookie());
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const connectToDB = require('./src/config/database.config');
connectToDB();


app.get('/', (req, res) => {
  res.send('Hello World!');
});

const Routes = require('./src/routes/auth.routes');
const task = require('./src/routes/task.routes');

app.use('/tasks', task);
app.use('/auth', Routes);




app.listen(3000, () => {
  console.log('Server is running on port 3000');
});