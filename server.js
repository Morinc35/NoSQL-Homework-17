const express = require('express');
const db =require('./config/connection')

const cwd = process.cwd();

const app = express();
const port = 3001;


const activity = cwd.includes('01-Activities')
  ? cwd.split('01-Activities')[1]
  : cwd;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


db.once('open', () => {
    app.listen(port, () => {
      console.log(`API server for ${activity} running on port ${port}!`);
    });
  });