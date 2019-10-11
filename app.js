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

//Tell Express to use 'body-parser'
app.use(bodyParser.urlencoded({extended: true}));
//Setting the default extension file '.ejs' for all the files that contain the HTML
app.set("view engine", "ejs");
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
const IP = process.env.IP;

//SCHEMA SETUP
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

//Create the model
const Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES
// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1496143372046-93ce70bf8ab9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
//     body: "Hello! This is a blog test"
// });

//HOME ROUTE
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
    res.render("index");
});
//Tell Express to listen for requests (start server)
app.listen(PORT, IP, function(){
    console.log("The YelpCamp App Server listening on PORT " + PORT);
});