/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _Divyanshu Sharma_____________________ Student ID: ___169341211___________ Date: ___03-02-2023_____________
*
*  Online (Cyclic) Link: 
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;

var express = require("express");
var app = express();
var path = require('path');
const blogService = require('./blog-service');


// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static(path.join(__dirname + '/public')));

// setup a 'route' to listen on the default url path (http://localhost)

app.get("/", function(req,res){
    res.redirect("/about");
});

// setup another route to listen on /about
app.get("/about", function(req,res){
  res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/blog", (req, res) => {
  blogService.getPublishedPosts().then((data) => {
      res.json({data});
  }).catch((err) => {
      res.json({message: err});
  })
});

app.get("/posts", (req, res) => {
  blogService.getAllPosts().then((data) => {
      res.json({data});
  }).catch((err) => {
      res.json({message: err});
  })
});

app.get("/categories", (req, res) => {
  blogService.getCategories().then((data) => {
      res.json({data});
  }).catch((err) => {
      res.json({message: err});
    })
});

// catch all for non-existent routes
app.get('*', (req, res) => {
  res.status(404).send("Page Not Found");
});

blogService.initialize()
.then(() => {
    //Start the server
    app.listen(HTTP_PORT, onHttpStart());
})
.catch((err) => {
    //Output the error to the console
    console.log(err);
});