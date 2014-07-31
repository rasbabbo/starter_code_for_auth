var bcrypt = require("bcrypt"),
 salt = bcrypt.genSaltSync(10),
 passport = require('passport'),
 passportLocal = require('passport-local');

module.exports = function (sequelize, DataTypes){
   var User = sequelize.define('user', {
     username: { 
        type: DataTypes.STRING, 
        unique: true, 
        validate: {
          len: [6, 30],
          }
    },
    password: {
        type:DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      }
    },
    
    {
      classMethods: {
        encryptPass: function(password){
          var hash = bcrypt.hashSync(password, salt);
          return hash;
          },
      //compare a password
        comparePass: function(userpass, dbpass) {
        //take care not to salt twice
          return bcrypt.compareSync(userpass, dbpass);
        //returns true or false
          },

        createNewUser: function(username, password, err, success) {
          if (password.length < 6) {
            err({message: "Password should be more than 6 characters, duh"});
              } else {
                  User.create({
                  username: username,
                  password: User.encryptPass(password)
                  }).error(function(error){
                  console.log(error);
                if(error.username) {
              //the error is defined by the validate objects in username definition
                  err({message: "Your username has to be 6 characters or longer"});
               } else {
                  err({message: "Someone or thing has already used this name - pick another"});
                  }
                   }).success(function(user){
                  success({message: "Account created, I guess you could log in"});
                });
              }
            },

        authorize: function(username, password, err, success) {
          //find user in the db
          User.find({
            where: { username: username }
            })
            //when that is complete...
            //the .done is used b/c of the asynchronous nature of JS
          .done(function(error, user) {
          if(err) {
            console.log(error);
            err({message: "Dang, something's messed up"});
          } else if (user === null) {
              err({message: "Username doesn't exist"});
              //these are called from the above defined functions
              //if not true then password is problem
          } else if ((User.comparePass(password, user.password)) === true) {
            success();
          } else {
            err({message: "Password is wrong"});
          }
        });
      }
      }
    } //close classMethods outer 

  ); // close define user
  return User;
}; // close User function

