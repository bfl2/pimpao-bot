const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
import Quiz from './quiz.js'


var currentQuiz = undefined
var status = 'hidden'
module.exports = {

	mountServer: function () {

		app.listen(8080,  function() {
			console.log('app listening on port 8080!');
		});
		app.get('/quiz', function(req, res) {
			buildHtml()
			res.sendFile(__dirname+"/index.html");
		});
		app.get('/quiz/css', (req, res) => {
			res.sendFile(__dirname+"/style.css");
		});
	},
	setQuiz: function(quiz) {
		currentQuiz = quiz
		console.log("quiz set")
	},
	eraseScreen: function() {
		currentQuiz = undefined
	}
}

function buildHtmlQuiz(quiz) {
	var header = `
	<!DOCTYPE html>
	<head> <meta http-equiv="Refresh" content="5">
	<link rel="stylesheet" href="http://localhost:8080/quiz/css">
	</head>
	`
	var content = quiz.question + " - " + quiz.correctAnswer
	var body = '<br><br> <body>' + content + '</body>'

	var html = header + '<html>' + body + '</html>';

	return html
}

function fooHtml() {
	var header = `
	<!DOCTYPE html>
	<head> <meta http-equiv="Refresh" content="5">
	<link rel="stylesheet" href="http://localhost:8080/quiz/css">
	</head>
	`
	var content = new Date().toUTCString();
	var body = '<br><br> <body>' + content + '</body>'

	var html = '<html>' + header + body + '</html>';
	return html
}
function emptyHtml() {
	var header = `
	<!DOCTYPE html>
	<head> <meta http-equiv="Refresh" content="5">
	<link rel="stylesheet" href="http://localhost:8080/quiz/css">
	</head>
	`
	var body = '<body></body>'
	var html = '<html>' + header + body + '</html>';

	return html
}

function buildHtml() {
	if(currentQuiz) {
		var html = buildHtmlQuiz(currentQuiz)
	} else {
		var html = emptyHtml()
	}
	fs.writeFileSync(__dirname+"/index.html", html)
}