var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',ensureAuthenticated ,function(req, res, next) { //the Auth function as parameter
  res.render('index', { title: 'Members' });
});

//Authentication Function
function ensureAuthenticated(req,res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
