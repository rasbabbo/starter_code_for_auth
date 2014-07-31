var repl = require('repl');
var db = require('./models/index.js');
var pkge = require("./package")
var newREPL = repl.start(pkge.name + " > ");


// db.user.create
// db.user.findAll().success(function(user){
//   console.log(user);
// });


// db.post.create({title: "blah", body:"stuff"});

// .find
// .findAll
// .create //save right after
// .build && .save
// .findOrCreate //will find and if not there create
// .addNAMEOFYOURMODEL
// .addPost


db.user.find({id:1}).success(function(user) {
  console.log(user);
});




// newREPL.context.db = db;