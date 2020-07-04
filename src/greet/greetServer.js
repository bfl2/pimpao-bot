// const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const { exec } = require('child_process');
const { time, timeStamp } = require('console');
const { text } = require('express');
const path_to_mplayer = "C:/Program Files (x86)/mplayer-svn-38119-x86_64/mplayer-svn-38119-x86_64/mplayer.exe"
const player = require('play-sound')({player: path_to_mplayer})

// Paths
const path_to_greeting_sounds = process.cwd() + "/resources/sounds/greeting-sounds/"
const path_to_sound_files = process.cwd() + "/resources/sounds/effect/"
const path_to_session = process.cwd() + "/resources/data/sessions/"

var greetedList = []
var toGreetList = []

var lastGreetTimestamp = 0

// Config File

var content = fs.readFileSync(__dirname+"/config.json");
var config = JSON.parse(content);
var port = config.Port
var serverStatus = config.ServerInitialStatus
const cooldownInMilisecondsForGreet = parseInt(config.GreetCooldown) * 1000
var greetTextTemplates = config.GreetTextTemplates

const greetDuration = 15
var lastGreetedUser = undefined

module.exports = {

	mountServer: function() {
		app.listen(port, function() {
			console.log(`Greet app listening on port ${port}!`);
		});
		app.get('/greet', function(req, res) {
			buildHtml()
			res.sendFile(__dirname+"/index.html");
		});
		app.get('/greet/css', (req, res) => {
			res.sendFile(__dirname+"/style.css");
		});
		app.get('/greet/bootstrap', (req, res) => {
			res.sendFile(__dirname+"/bootstrap.min.css");
		});
		loadGreetedList()
	},

	tickServer: function(username) {
		if(serverStatus != "closed") {
			if(username != null && username != undefined) {
				this.addToGreetQueue(username)
			}
			this.checkForGreet()
		}
	},

	toggleServer: function() {
		if(serverStatus == "closed") {
			serverStatus = "open"
		} else {
			serverStatus = "closed"
		}
	},

	addToGreetQueue: function(username) {
		if(username == undefined) {
			return
		}
		var userAlreadyInList = toGreetList.includes(username) || greetedList.includes(username)
		if(userAlreadyInList) {
			return
		} else if( !toGreetList.includes(username)) {
			toGreetList.push(username)
		}
	},

	checkForGreet: function() {
		var currentTime = Date.now()
		if(currentTime > lastGreetTimestamp + cooldownInMilisecondsForGreet) {
			var res = greetUserWithSound()
		}
	},
}

function greetUserWithSound() {
	var currentTime = Date.now()
	var userToGreet = undefined
	if (toGreetList.length == 0) {
		return false
	} else {
		userToGreet = toGreetList.shift()
		if(userToGreet == undefined) {
			return false
		}
	}

	if(!greetedList.includes(userToGreet)) {
		var userSoundFilename = getUserGreetingSoundFilename(userToGreet)
		if(userSoundFilename != null) {
			playGreetingSound(userSoundFilename)
		}
		greetedList.push(userToGreet)
		appendToList(userToGreet)
		lastGreetTimestamp = currentTime
		lastGreetedUser = userToGreet
		console.log(`\t[GREET] greeted ${userToGreet}`)
		setGreetActive()
		return true
	} else {
		return false
	}
}

function setGreetActive() {
	serverStatus = "open"
	setTimeout(function() {
		serverStatus = "idle"
	}, greetDuration * 1000)
}

function appendToList(username) {
	var listPath = getSessionFilename()
	if(fs.existsSync(listPath)) {
		fs.appendFile(listPath, "\n"+username, function (err) {
			if (err) throw err;
			console.log(`wrote: ${username} to session:${listPath}`);
		});
	} else { //Day changed mid session
		fs.writeFile(listPath, "Session*: " + listPath, function (err) {
			if (err)
				return console.log(`Error: ${err}`);
			console.log(`Creating session(mid session) file: ${listPath}`);
		});
		greetedList.forEach(element =>{
			fs.appendFile(listPath, "\n"+username, function (err) {
				if (err) throw err;
				console.log(`wrote: ${username} to session:${listPath}`);
			}
		)});
	}

}

function getSessionFilename() {
	var today = new Date();
	var day = String(today.getDate()).padStart(2, '0');
	var month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var year = String(today.getFullYear());
	var filename = day + "-" + month + "-" + year + ".txt"
	var fullpath = path_to_session + filename
	return fullpath
}


function getUserGreetingSoundFilename(username) { // returns null if user has no sound configured
	var files = fs.readdirSync(path_to_greeting_sounds);
	var filename = null
	files.forEach(element =>{
		if(element.toLowerCase().includes(username)) {
			filename = element
		}
	});
	return filename
}

function playGreetingSound(filename) {
	var fullpath = path_to_greeting_sounds + filename
	console.log(`playing ${fullpath}`)
	player.play(fullpath, function(err){
		if(err != null)
			console.log(`Error when trying to play ${fullpath} Err: ${err}`)
	})
}

function loadGreetedList() {
	var listPath = getSessionFilename()
	console.log("Session: " + listPath)
	if(fs.existsSync(listPath)) { //session already exists
		var content = String(fs.readFileSync(listPath))
		greetedList = content.split("\n")
	} else {
		fs.writeFile(listPath, "Session " + listPath, function (err) {
			if (err)
				return console.log(`Error: ${err}`);
			console.log(`Creating session file: ${listPath}`);
		});
	}
}

/**
 * HTML generation
 */

function buildHtml()
{
	switch(serverStatus)
	{
		case "open":
			var html = greetHTML()
			break;
		case "idle":
			var html = emptyHtml()
			break
		default:
			var html = emptyHtml()
			break;
	}

	fs.writeFileSync(__dirname + "/index.html", html)
}

function getGreetText(username)
{
	console.log("getGreetText="+username)
	if(username == undefined)
	{
		console.log("Error getGreetText")
		return ""
	}
	var res = ""
	if(greetTextTemplates != undefined) {
		var textTemplate = greetTextTemplates[Math.round(Math.random())*greetTextTemplates.length]
		if(textTemplate != undefined)
		{
			res = textTemplate.replace("<user>", username)
		}
	}
	return res
}

function greetHTML()
{
	var bubbleText = getGreetText(lastGreetedUser)
	var html =
	`<!DOCTYPE html>
	<html>
		<head>
			<meta http-equiv="Refresh" content="10">
			<link rel="stylesheet" href="http://localhost:${port}/greet/bootstrap">
			<link rel="stylesheet" href="http://localhost:${port}/greet/css">
		</head>
		<body>
			<blockquote class="speech bubble">${bubbleText}</blockquote>
		</body>
	</html>`

	return html
}

function emptyHtml()
{
	var html =
	`<!DOCTYPE html>
	<html>
		<head>
			<meta http-equiv="Refresh" content="5">
			<link rel="stylesheet" href="http://localhost:${port}/greet/css">
		</head>
		<body>
			<div>
			</div>
		</body>
	</html>`

	return html
}
