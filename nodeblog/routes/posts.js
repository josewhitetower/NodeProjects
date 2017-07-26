var express = require('express');
var router = express.Router();
var multer = require('multer'); //To Upload files
var upload = multer({ dest: './public/images' }) // and their destinations
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next) {
    var categories = db.get('categories');
    categories.find({}, {}, function(err, categories) {
        res.render('addpost', { //from here will be necessary to create that template, wich can be found on views
            'title': 'Add post',
            'categories': categories
        });
    });

});

router.post('/add', upload.single('mainimage'), function(req, res, next) {
    //Get the Form Values
    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;
    var author = req.body.author;
    var date = new Date();
    if (req.file) {
        var mainimage = req.file.filename
    } else {
        var mainimage = 'noimage.jpg'
    }
    //Form validator
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    //Check errors

    var errors = req.validationErrors();
    if (errors) {
        res.render('addpost', {
            "errors": errors
        });
    } else {
        var post = db.get('posts');
        post.insert({
            "title": title,
            "body": body,
            "category": category,
            "date": date,
            "author": author,
            "mainimage": mainimage,

        }, function(err, post) {
            if (err) {
                res.send('err');
            } else {
                req.flash('success', 'Post added');
                res.location('/');
                res.redirect('/');
            }

        });
    }

});

module.exports = router;