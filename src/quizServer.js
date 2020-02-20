const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
import Quiz from './quiz.js'


var currentQuiz = undefined
var status = 'inProgress'
var lastUserToAnswer = undefined
module.exports = {

	mountServer: function () {
		status = 'hidden';
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
	getStatus: function() {
		return status
	},
	setQuiz: function(quiz) {
		status = 'inProgress';
		currentQuiz = quiz
		console.log("quiz set" + quiz)
	},
	checkAnswer: function(answer, username) {
		lastUserToAnswer = username
		if(currentQuiz != undefined) {
			if(currentQuiz.isAnswerCorrect(answer)) {
				status = "completed"
				return true;
			}
		}
		return false;
	},
	eraseScreen: function() {
		status = "hidden"
		currentQuiz = undefined
	}
}

function buildHtmlQuiz() {
	var quiz = currentQuiz;
	var imgSource = "";
	var html =
	`<!DOCTYPE html>
	<html>
		<head> <meta http-equiv="Refresh" content="5">
		<link rel="stylesheet" href="http://localhost:8080/quiz/css">
		</head>
		<body>
			<div class="outer-container">
				<div class="inner-container-top">
					<div class="right">
						<img src=${imgSource}></img>
					</div>
					<div class="left">
					Quiz:
						<br>
						<p>${quiz.question}</p>
					</div>
				</div>
			</div>
		</body>
	</html>`

	return html
}

function finishedQuizHtml() {
	var quiz = currentQuiz;
	var imgSource = "";
	var html =
	`<!DOCTYPE html>
	<html>
		<head> <meta http-equiv="Refresh" content="5">
		<link rel="stylesheet" href="http://localhost:8080/quiz/css">
		</head>
		<body>
			<div class="outer-container">
				<div class="inner-container-top">
					<div class="right">
						<img src=${imgSource}></img>
					</div>
					<div class="left">
					Quiz:
						<br>
						<p>${quiz.question}</p>
					</div>
				</div>
				<div class="inner-container-bottom">
					<p>	Resposta: ${quiz.correctAnswer}</p>
					<p> por:${lastUserToAnswer}	</p>
				</div>
			</div>
		</body>
	</html>`

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
	switch(status)
	{
		case "inProgress":
			if(currentQuiz) {
				var html = buildHtmlQuiz()
			} else {
				status = "hidden"
				var html = emptyHtml()
			}
			break;
		case "completed":
			var html = finishedQuizHtml()
			break;
		case "hidden":
			var html = emptyHtml()
			break;
	}

	fs.writeFileSync(__dirname+"/index.html", html)
}