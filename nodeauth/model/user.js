var mongoose=require('mongoose');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/nodeauth', {
  useMongoClient: true,
  /* other options */ //As it was deprecated
});

var db= mongoose.connection;

//User Schema
var UserSchema = mongoose.Schema({
  username:{
      type: String,
      index: true
  },
  password:{
        type: String
  },
  email:{
      type: String
  },
  name:{
      type: String
  },
  profileimage:{
      type: String
  }
});

var User = module.exports= mongoose.model('User', UserSchema);//To use it outside this file

module.exports.createUser=function(newUser, callback){ //This function will aviable from outside
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password=hash;
        newUser.save(callback);
    });
});

}