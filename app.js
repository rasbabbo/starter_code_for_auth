// app.js

var express = require('express'),
  db = require('./models/index.js'),
  bodyParser = require('body-parser'),
  methodOvrride = require('method-override'),
  app = express();

app.set('view engine', 'ejs');

app.use(methodOvrride());
app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

// logging every request
app.use(function(req, res, next){
  console.log(req.method, req.url);
  next();
});

//AUTHENTICATION

app.get('/', function(req, res) {
  if(!req.user) {
    res.render('signup');
  } else {
    res.redirect('home');
  }
});


app.get('signup', function(req, res) {
  if(!req.user) {
    res.render('signup', {message: null, username: ""});
  } else {
    (res.redirect('/login'));
  }
})

app.get('/login', function(req, res) {
  res.render('login', {message: null})
});

app.post('/login', function(req, res) {
  db.user.authorize(req.body.username, req.body.password,
    function(err) {
      res.render('login', {message: err.message})
      }, function(success) {
        res.render('home', {message: success.message});
      })
    });

// app.post('/create', function(req, res) {
//   db.user.createNewUser(req.body.username, req.body.password,
//     function(err) {
//       res.render('login', {message: err.message, username: req.body.username})
//       res.redirect('home');
//     });
// });

// app.get('home', function(req, res) {
//   res.render('home', {isAuthenticated: req.isAuthenticated(),
//     user: req.user
//   });
// });

// app.get('*', function(){
//   res.render('404');
// });




//logging
app.get('/posts/new', function(req, res) {
  res.render('posts/new');
});

app.post('/posts', function(req, res) {
  console.log("inside /post posts")
  db.user.findOrCreate({username: req.body.username, password: req.body.password})
    .error(function(err) {
      res.send(err);
    })
    .success(function(user) {
      // res.send(user);
      var newPost = db.post.build({title: req.body.title, body: req.body.body});
        user.addPost(newPost).success(function(post) {
        res.send(post);
      });
    });
  // console.log(req.body);
  // res.redirect('/');
});


app.get('/users', function (req,res) {
  db.user.findAll()
  .success(function(allUsers){
    res.render('users/index', {user: allUsers});
  });
//
});

app.get('/users/:id', function (req,res) {
  var id = req.params.id;
  db.user.find(3)
  .success(function(foundUser){
    foundUser.getPosts() 
     .success(function(foundPosts) {
      res.render('users/show', {
        user: foundUser,
        posts: foundPosts
      });
    })
  });
});


app.get('/posts/:id', function (req,res) {
  var id = req.params.id;
  db.posts.find(id)
  .success(function(foundPost) {
    res.render('posts/show', {
      post:foundPost
    });
  });
});

app.get('/users/:id/posts/new', function(req, res){
  var id = req.params.id;
  db.user.find.id
  .success(function(foundUser) {
    res.render('posts/new', {
      user: foundUser
    });
  });
});

app.post('/users/:id/posts', function(req, res){
  var id = req.params.id;
  db.user.find(id)
  .success(function(foundUser) {
    db.post.create(req.body.post)
     .success(function(newPost){
      foundUser.addPost(newPost)
       .success(function(){
        res.redirect('/posts/' + newPost.dataValues.id);
       });
     });
    })
  .error(function(err){
    res.redirect('/users');
  });
});




app.listen(3000, function(){
  console.log("LISTENING ON PORT 3000")
})
