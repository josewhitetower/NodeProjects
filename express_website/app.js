var express=require('express');
var path = require('path');
var bodyParser= require('body-parser');
var nodemailer= require('nodemailer');

var app= express();
var title='Welcome...';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/', function (req, res) {
 res.render('index', {title: title } );
});

app.get('/about', function (req, res) {
 res.render('about', {title: title});
});

app.get('/contact', function (req, res) {
 res.render('contact', {title: title });
});

app.post('/contact/send', function (req, res) {
 var transporter= nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user:'josewhitetower@gmail.com',
        pass: ''
    }
 });

var mailOptions={
  from: 'Jose josewhitetower@gmail.com',
  to: 'josewhitetower@gmail.com',
  subject: 'Website submision',
  text: 'You have a submission with the followinf details...Name: '+req.body.name+'Email: '+req.body.email+'Message: '+req.body.message,
  html: '<p>You have a submission with the following details...</p><ul><li>Name: '+req.body.name+'</li><li>Email: '+req.body.email+'</li><li>Message: '+req.body.message+'</li></ul>'
  };


   transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
      res.send(error);
    } else {
      console.log('Message Sent: '+info.response);
      res.redirect('/');
    }
  });
});
app.listen(3000);
console.log('Server running on port 3000');