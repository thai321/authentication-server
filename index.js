const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router')
const app = express();

const mongoose = require('mongoose');
//DB Setup
mongoose.connect('mongodb://localhost:auth/auth');


// App Setup

// Middlewares of morgan and bodyParser
app.use(morgan('combined')); // login framework, incomming request, mostly use
// it for debugging

app.use(bodyParser.json({type: '*/*' }));
router(app);

//Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app); // tell http to create a server
server.listen(port);
console.log('Server listening on:', port)
