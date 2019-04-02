const express = require("express");
const helmet = require("helmet");
const port = process.env.PORT || 3000;
const app = express();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//----- SETUP ------//

//Use Helmet
app.use(helmet());

//Setup Static Folder
app.use(express.static("public"));

//Parse Body
app.use(express.urlencoded({extended: true}));

//Set EJS Templete Engine
app.set('view engine', 'ejs');

//----- POSTS DB ------//
let posts = [];

//----- ROUTES ------//

//Index - GET
app.get("/", function(req, res) {
  res.render("home", {
    homeContent: homeStartingContent,
    posts: posts
  });
});

//About - GET
app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

//Contact - GET
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

//Compose - GET
app.get("/compose", function(req, res) {
  res.render("compose");
});

//Compose - POST
app.post("/compose", function(req, res) {

  //Grab form data and store in an Object
  const post = {
    title: req.body.title,
    content: req.body.content
  };

  //Make sure post data is not blank
  if(post.title.length !== 0 && post.content.length !== 0) {
    //Push post into Posts DB array
    posts.push(post);

    //Redirect to Index
    res.redirect("/");
  }
});

//----- SERVER ------//

//Start Server
app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});
