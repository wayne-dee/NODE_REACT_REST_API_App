const express = require('express');

const path = require('path');

const mongoose = require('mongoose')

const bodyParser = require('body-parser');

const multer = require('multer');

const feedRoutes = require('./routes/feed');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  // app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
  app.use(bodyParser.json()); // application/json
  app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
  );
  app.use('/images', express.static(path.join(__dirname, 'images')));

// server to send response to client // diff port i.e codepen.io //
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()
})

app.use('/feed', feedRoutes);

// ERROR HANDLING middleware
app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).json({ message: message })
})

mongoose.connect(
    'mongodb+srv://onkeo:Douglous3@retailshopnode.cwxp1.mongodb.net/Messages'
).then(result => {
    console.log('connected to DB')
    app.listen(8080)
}).catch(err => {
    console.log(err)
});

