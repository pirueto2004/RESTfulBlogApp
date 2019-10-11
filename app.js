const bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      express = require("express"),
      app = express(),
      DATABASE_NAME = 'restful_blog_app',
      mongoURI = `mongodb://localhost:27017/${DATABASE_NAME}`;

//Set up promises with mongoose
mongoose.Promise = Promise; 

//if there's a shell environment variable named MONGODB_URI (deployed), use it; otherwise, connect to localhost
const dbUrl = process.env.MONGODB_URI || mongoURI;

// mongoose.connect(MONGOLAB_URI || mongoURI, { useNewUrlParser: true });
mongoose.connect(dbUrl, { useNewUrlParser: true });