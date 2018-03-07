'use strict';

const express = require('express');
//using morgan to make sure server logs are standarized
const morgan = require('morgan');
//using mongoose for connecting to the server
const mongoose = require('mongoose');

const app = express();

//bring over Port & DATABASE_URL from config.js
const { PORT, DATABASE_URL } = require('./config');

app.use(express.static('public'));

if (require.main === module) {
  app.listen(process.env.PORT || 8080, function () {
    console.info(`App listening on ${this.address().port}`);
  });
}

//the variable server is blank but will be assigned under runServer and will be used again in closerserver
let server;

//as stated this fundtion runs the server
function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

//as stated this function closes the server
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

//if not the any useable end point then display a message
app.use('*', function (req, res) {
  res.status(404).json({ message: 'Page Not Found' });
});

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };