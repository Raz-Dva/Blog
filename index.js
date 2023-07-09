// const http = require('http'),
//     express = require('express'),
    // server = http.createServer(app),
    // mongoose = require('mongoose'),
    // router = require('./router/routes'),
    // controller = require('./controllers/controller');

// require('dotenv').config();

import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import router from './router/routes.js';
import controller from './controllers/controller.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express(),
    server = http.createServer(app),
    port = 5000;

//---------------- express static
app.use(express.static(__dirname + "/templates"));
app.use('/public', express.static(__dirname + '/public'));
app.use('/templates', express.static(__dirname + '/templates'));
app.use(express.json());
// ------------  routes --------

app.use('/', router);

app.delete('/delete/:id', controller.deletePost);
//---------------- error and 404
app.use((err, req, res, next) => {
    const isNotFound = ~err.message.indexOf('not found')
    const isCastError = ~err.message.indexOf('Cast to ObjectId failed')
    if (err.message && (isNotFound || isCastError)) {
        return next(err)
    }
    console.log(err.stack);
    res.status(404).json({ Error: err.stack })
});
app.get('*', function (req, res) {
    res.status(404).type('text/html');
    res.send("<h1> Not found 404</h1>"); // add page not found
});
// ------------  mongoose --------

mongoose.connect('mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@cluster0.qy6hg4h.mongodb.net/' + process.env.DB_NAME + '?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) return console.log('error connect mongoose DB' + err);

    server.on('error', function (e) {
        console.log('Mongoose default connection error: ' + err);
    });

    server.listen(process.env.PORT || port, () => {
        console.log(`Server is run on port ${process.env.PORT || port}`);
        console.log('Mongoose connection successful');
    });
});


