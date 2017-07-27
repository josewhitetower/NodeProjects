var express = require('express');
var router = express.Router();
var multer = require('multer'); //To Upload files
var upload = multer({ dest: './public/images' }) // and their destinations
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/show/:id', function(req, res, next) {
    var posts = db.get('posts');
    posts.findById(req.params.id, function(err, post) {
        res.render('show', { //from here will be necessary to create that template, wich can be found on views
            'post': post
        });
    });

});


router.get('/add', function(req, res, next) {
    var categories = db.get('categories');
    categories.find({}, {}, function(err, categories) {
        res.render('addpost', { //from here will be necessary to create that template, wich can be found on views
            'title': 'Add post',
            'categories': categories //Addpost template will already have the categories loaded
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

router.post('/addcomment', (req, res, next) => {
    //Get the Form Values
    var name = req.body.name;
    var email = req.body.email;
    var body = req.body.body;
    var postid = req.body.postid;
    var commentdate = new Date();

    //Form validator
    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("email", "Email is required but never displayed").notEmpty();
    req.checkBody("email", "Email is not formatted properly").isEmail();
    req.checkBody("body", "Body is required").notEmpty();

    //Check errors

    var errors = req.validationErrors();
    if (errors) {
        var post = db.get("posts");
        posts.findById(postid, (err, post) => {
            res.render("show", {
                "errors": errors,
                "post": post
            });
        });

    } else {
        var comment = {
            "name": name,
            "email": email,
            "body": body,
            "commentdate": commentdate
        }
        var posts = db.get('posts');
        posts.update({
            "_id": postid
        }, {
            $push: {
                "comments": comment
            }
        }, (err, doc) => {
            if (err) {
                throw err;
            } else {
                req.flash('success', 'Comment added');
                res.location('/posts/show/' + postid);
                res.redirect('/posts/show/' + postid);
            }
        });
    }

});

module.exports = router;