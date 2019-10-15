const bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      express = require("express"),
      expressSanitizer = require("express-sanitizer"),
      app = express(),
      methodOverride = require("method-override"),
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
app.use(methodOverride("_method"));
app.use(expressSanitizer());

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

//ROOT ROUTE
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
    //retrieve all the blogs from the database
    Blog.find({}, function(err, blogs){
        if(err) {
            console.log("ERROR!", err);
        }else {
            res.render("index", {blogs: blogs});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
    const data = req.body.blog;
    //create blog
    console.log(req.body);
    
    console.log("===================");
    console.log(req.body);
    Blog.create(data, function(err, newBlog){
        if(err){
            res.render("new");
        }else {
            //then, redirect to the index
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            // res.send("SHOW PAGE!");
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    // Blog.findByIdAndUpdate(id, newData, callback);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
    //redirect somewhere
});

//Tell Express to listen for requests (start server)
app.listen(PORT, IP, function(){
    console.log("The YelpCamp App Server listening on PORT " + PORT);
});