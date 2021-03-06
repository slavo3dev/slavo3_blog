//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
// const p = require(__dirname + "/passwords")




const homeStartingContent = "Slavo3dev";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

// Heroku env variables
let password = process.env.PASSWORD || p.PASS;
let port = process.env.PORT || 3000;
// let password = process.env.PASSWORD

mongoose.connect(`mongodb://slavo3dev:${password}@mimicom24-shard-00-00-wbdvr.mongodb.net:27017,mimicom24-shard-00-01-wbdvr.mongodb.net:27017,mimicom24-shard-00-02-wbdvr.mongodb.net:27017/slavoblog?ssl=true&replicaSet=MimiCom24-shard-0&authSource=admin&retryWrites=true`, {useNewUrlParser: true});

const blogSchema =  { 
    title: String,
    post: String 
  }

const Blog = mongoose.model("Blog", blogSchema)

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {

  Blog.find((err, blogs) => {
    if(err){
      console.log(`Error: ${err}`)
    } else {
      res.render("home", {
        homePageContent: homeStartingContent, 
        posts: blogs
      });
    }
  });

})

app.get("/about", (req, res) => {
  res.render("about", {aboutPageContent: aboutContent});
})

app.get("/contact", (req, res) => {
  res.render("contact", {contactPageContent: contactContent});
})

app.get("/compose", (req, res) => {
  res.render("compose");
})

app.post("/compose", (req, res) => {
    let post = {
      titleValue: req.body.titleValue,
      postValue: req.body.postValue
    }
    const blog = new Blog({
      title: post.titleValue,
      post: post.postValue
    })

    blog.save((err) =>{
          if(err){
               console.log(`Error: ${err}`)
                }
             else { 
               console.log("Your Post is saved")
               res.redirect("/");
              }
             })
    //   .then(() => console.log("Your Post is saved!!"))
    // res.redirect("/");
    
})

app.get("/post/:post", (req, res) => {
  let requestID = req.params.post;
  console.log(requestID)

  Blog.findOne({_id:requestID}, (err, blog) => {
    if(err){
      console.log(`Error: ${err}`)
      res.redirect('/');
    } else {
      res.render("post", {
        titleValue: blog.title,
        postValue: blog.post 
      })
    }
  })  
})

app.listen(port, function() {
  console.log(`Server is running on port: ${port}`);
});


