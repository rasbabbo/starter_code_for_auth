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
  console.log(req.method, req.url)
  next()
});


//logging
app.get('/posts/new', function(req, res) {
  res.render('posts/new');
})

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
        req.send(post);
      })
    });
  // console.log(req.body);
  // res.redirect('/');
});


app.get('/users', function (req,res) {
  db.user.findAll()
  .success(function(allUsers){
    res.render('users/index', {user: allUsers});
  })
//
});

app.get('/users/:id', function (req,res) {
  //
});

app.get('/posts/:id', function (req,res) {
  var id = req.params.id;
  //

});

app.get('/users/:id/posts/new', function(req, res){
  var id = req.params.id;
  //
});

app.post('/users/:id/posts', function(req, res){
  var id = req.params.id;
  //
});




app.listen(3000, function(){
  console.log("LISTENING ON PORT 3000")
})
