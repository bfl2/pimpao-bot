const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
import Quiz from './quiz.js'
import soundController from "./soundController";

var port = 8080
var currentQuiz = undefined
var status = 'inProgress'
var lastUserToAnswer = undefined
var quizList = undefined
module.exports = {

	mountServer: function () {
		status = 'hidden';
		app.listen(port,  function() {
			console.log('app listening on port 8080!');
		});
		app.get('/quiz', function(req, res) {
			buildHtml()
			res.sendFile(__dirname+"/index.html");
		});
		app.get('/quiz/css', (req, res) => {
			res.sendFile(__dirname+"/style.css");
		});
		loadQuizFiles()
	},
	getStatus: function() {
		return status
	},
	setQuiz: function(quiz) {
		status = 'inProgress';
		currentQuiz = quiz
	},
	setRandomQuiz: function(){
		console.log("		Starting random quiz")
		status = 'inProgress';
		//var randomIndex = Math.floor(Math.random() * this.length);
		//currentQuiz = quizList[randomIndex];
		//quizList.splice(randomIndex, 1);
		currentQuiz = quizList.pop()//
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

function loadQuizFiles() {
	var rawJson = fs.readFileSync(path.resolve(__dirname, "../quiz-files/quizset.json")).toString();
	var parsedJson = JSON.parse(rawJson)
	quizList = new Array();
	parsedJson.set.forEach(element => { //List is in set property
		quizList.push(new Quiz(element.question, element.answer, element.type))
	});
	quizList.sort(function () {
		return Math.round(Math.random()) - 0.5
	})

}

function buildHtmlQuiz() {
	var quiz = currentQuiz;
	var imgSource = ""// TODO implement img support`http://localhost:8080/quiz/img/${currentQuiz.imgSource}`;
	var html =
	`<!DOCTYPE html>
	<html>
		<head>
			<meta http-equiv="Refresh" content="5">
			<link rel="stylesheet" href="http://localhost:8080/quiz/css">
		</head>
		<body>
			<div class="outer-container">
				<div class="inner-container-top pulse">
					<div class="right">
						<img src="${imgSource}"></img>
					</div>
					<div class="left">
					Quiz:
						<p>${quiz.question}?</p>
					</div>
				</div>
			</div>
		</body>
	</html>`

	return html
}

function finishedQuizHtml() {
	//TODO: consider using <meta http-equiv="Refresh" content="5">
	var quiz = currentQuiz;
	var imgSource = ""// TODO implement img support`http://localhost:8080/quiz/img/${currentQuiz.imgSource}`;
	var html =
	`<!DOCTYPE html>
	<html>
		<head>
			<meta http-equiv="Refresh" content="5">
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
						<p>${quiz.question}?</p>
					</div>
				</div>
				<div class="inner-container-bottom">
					Resposta: ${quiz.correctAnswer}
					<p>por:${lastUserToAnswer}</p>
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