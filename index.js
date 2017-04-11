'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

// set the view engine to ejs
app.use('/required', express.static('required'));
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 3000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// // Index route
app.get('/', function (req, res) {
	res.render('pages/index');
});

app.get('*', function(req, res) {
    res.render('pages/index');
});

// // Index route
// app.get('/', function (req, res) {
// 	res.render('pages/maintaince');
// });

// app.get('*', function(req, res) {
//     res.render('pages/maintaince');
// });

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
});
