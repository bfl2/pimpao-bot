// const path = require('path');
const fs = require('fs');
// const express = require('express');
// const app = express();
const { exec } = require('child_process');
const { time, timeStamp } = require('console');
const path_to_mplayer = "C:/Program Files (x86)/mplayer-svn-38119-x86_64/mplayer-svn-38119-x86_64/mplayer.exe"
const player = require('play-sound')({player: path_to_mplayer})

const path_to_greeting_sounds = process.cwd() + "/resources/sounds/greeting-sounds/"
const path_to_sound_files = process.cwd() + "/resources/sounds/effect/"
const path_to_session = process.cwd() + "/resources/data/sessions/"

var greetedList = []
var toGreetList = ['ursope']
var serverStatus = "open"

const cooldownInSecondsForGreet = 30000
var lastGreetTimestamp = 0

// Config File

module.exports = {

	mountServer: function() {
		this.loadGreetedList()
		this.greetUser("correct")
	},

	tickServer: function(username = null) {
		if(serverStatus == "open") {
			if(username != null) {
				this.addToGreetQueue(username)
			}
			this.checkForGreet()
		}
	},

	toggleServer: function() {
		if(serverStatus == "open") {
			serverStatus = "closed"
		} else {
			serverStatus = "open"
		}
	},

	loadGreetedList: function () {
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
	},
	addToGreetQueue: function(username) {
		var userAlreadyInList = toGreetList.includes(username) || greetedList.includes(username)
		if(userAlreadyInList) {
			return
		} else if( !toGreetList.includes(username)) {
			toGreetList.push(username)
		}
	},
	checkForGreet: function() {
		var currentTime = Date.now()
		if(currentTime > lastGreetTimestamp + cooldownInSecondsForGreet) {
			var userToGreet = toGreetList.shift()
			var res = this.greetUser(userToGreet)
			if(res) {
				greetedList.push(userToGreet)
				appendToList(userToGreet)
				lastGreetTimestamp = currentTime
			}
		}
	},

	greetUser: function (username) {
		if(!greetedList.includes(username)) {
			var userSoundFilename = getUserGreetingSoundFilename(username)
			if(userSoundFilename != null) {
				playGreetingSound(userSoundFilename)
			}
			greetedList.push(username)
			console.log(`\t[GREET] greeted ${username}`)
			return true
		} else {
			return false
		}
	}
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