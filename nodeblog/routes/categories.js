var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
//To show the posts of the category
router.get('/show/:category', function(req, res, next) { //Dynamic, this is gonna be the id of the category
    var posts = db.get('posts');
    posts.find({ category: req.params.category }, {}, function(err, posts) {
        res.render('index', { //from here will be necessary to create that template, wich can be found on views
            'title': req.params.category,
            'posts': posts
        });
    });
});


router.get('/add', function(req, res, next) {
    res.render('addcategory', {
        'title': 'Add Category' //Tile of the page (view)
    });
});

router.post('/add', function(req, res, next) {
    // Get Form Values
    var name = req.body.name;

    // Form Validation
    req.checkBody('name', 'Name field is required').notEmpty();

    // Check Errors
    var errors = req.validationErrors();

    if (errors) {
        res.render('addcategory', {
            "errors": errors
        });
    } else { // Insert categories
        var categories = db.get('categories');
        categories.insert({
            "name": name,
        }, function(err, post) {
            if (err) {
                res.send(err);
            } else { //Redirect
                req.flash('success', 'Category Added');
                res.location('/');
                res.redirect('/');
            }
        });
    }
});

module.exports = router;