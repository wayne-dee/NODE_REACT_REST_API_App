const express = require('express');

const bodyParser = require('body-parser')

const feedRoutes = require('./routes/feed');
const res = require('express/lib/response');

const app = express();

const d = null

app.use(bodyParser.json()) // application.json

// server to send response to client // diff port i.e codepen.io //
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()
})

app.use('/feed', feedRoutes)

app.listen(8080)