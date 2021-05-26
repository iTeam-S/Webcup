const express = require('express')
const app = express()
const port = 8000
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(fileUpload());

var router = require('./bin/express-router')();
require('./router/route')(router); 

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);

app.listen(port ,() => {
  console.log(`==========>> SERVER LISTENING <<==========`)
})
