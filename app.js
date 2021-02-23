const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const Post = require('./models/Post');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 3000;
const app = express();

const homeStartingContent =
  'Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.';
const aboutContent =
  'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.';
const contactContent =
  'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.';

//----- SETUP ------//

//Use Helmet
app.use(helmet());

//Setup Static Folder
app.use(express.static('public'));

//Parse Body
app.use(express.urlencoded({ extended: true }));

//Set EJS Templete Engine
app.set('view engine', 'ejs');

//----- Mongo DB ------//
mongoose.connect(
  `mongodb+srv://chris:${process.env.DB_PASS}@cluster0.169fs.mongodb.net/daily-journal`,
  { useNewUrlParser: true },
  function() {
    console.log('Connected to Mongo DB');
  }
);

//----- ROUTES ------//

//Index - GET
app.get('/', function(req, res) {
  Post.find({}, function(err, foundPosts) {
    if (err) {
      res.send(err);
    }

    res.render('home', {
      homeContent: homeStartingContent,
      posts: foundPosts
    });
  });
});

//About - GET
app.get('/about', function(req, res) {
  res.render('about', {
    aboutContent: aboutContent
  });
});

//Contact - GET
app.get('/contact', function(req, res) {
  res.render('contact', {
    contactContent: contactContent
  });
});

//Compose - GET
app.get('/compose', function(req, res) {
  res.render('compose');
});

//Single Post - GET
app.get('/posts/:postName', function(req, res) {
  //Store route parameter from url in variable
  let query = req.params.postName;

  Post.find({}, function(err, posts) {
    if (err) {
      res.send(err);
    }

    //Loop through posts and look for match
    posts.forEach(function(foundPost) {
      const storedTitle = foundPost.title;

      //If match found render post
      if (storedTitle.toLowerCase() == query.toLowerCase()) {
        res.render('post', {
          foundPost: foundPost
        });
      }
    });
  });
});

//Compose - POST
app.post('/compose', function(req, res) {
  //Grab form data and store in an Object
  const post = {
    title: req.body.title.trim(),
    content: req.body.content
  };

  //Create New Post
  const newPost = new Post(post);

  //Save post to DB
  newPost.save(function(err, savedPost) {
    if (err) {
      res.send(err);
    }
    console.log(`Saved Post ${savedPost.title}`);
    res.redirect('/');
  });
});

//Delete - POST (Delete Post)
app.post('/delete', function(req, res) {
  const { postToDelete } = req.body;

  Post.findByIdAndRemove(postToDelete, function(err, deletedPost) {
    if (err) {
      res.send(err);
    }
    console.log(`Removed ${deletedPost.title}`);
    res.redirect('/');
  });
});

//----- SERVER ------//

//Start Server
app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});
