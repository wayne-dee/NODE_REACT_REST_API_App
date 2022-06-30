const express = require('express');

const path = require('path');

const mongoose = require('mongoose')

const bodyParser = require('body-parser')

const feedRoutes = require('./routes/feed');

const app = express();

const d = null

app.use(bodyParser.json()) // application.json
app.use('/images', express.static(path.join(__dirname, 'images')));

// server to send response to client // diff port i.e codepen.io //
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()
})

app.use('/feed', feedRoutes)

mongoose.connect(
    'mongodb+srv://onkeo:Douglous3@retailshopnode.cwxp1.mongodb.net/Messages'
).then(result => {
    console.log('connected to DB')
    app.listen(8080)
}).catch(err => {
    console.log(err)
});

