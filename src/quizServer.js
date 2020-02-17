var path = require('path');
const fs = require('fs');
const express = require('express');
var app = express();

module.exports = { mountServer: function () {
	var app = express();
	app.listen(8080,  function() {
		console.log('app listening on port 8080!');
	});
	app.get('/quiz', function(req, res) {
		fs.writeFileSync(__dirname+"/index.html", buildHtml())
		res.sendFile(__dirname+"/index.html");
	});
	app.get('/quiz/css', (req, res) => {
		res.sendFile(__dirname+"/style.css");
	});

	}
}

function buildHtml(req) {
	var header = `
	<!DOCTYPE html>
	<head> <meta http-equiv="Refresh" content="5">
	<link rel="stylesheet" href="http://localhost:8080/quiz/css">
	</head>
	`
	var content = new Date().toUTCString();
	var body = '<br><br> <body>' + content + '</body>'

	var html = '<html>' + header + body + '</html>';
	// concatenate header string
	// concatenate body string

	return html
	};