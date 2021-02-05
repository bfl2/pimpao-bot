const fs = require('fs');
const { exec } = require('child_process');
const path_to_mplayer = "C:/Program Files (x86)/mplayer-svn-38119-x86_64/mplayer-svn-38119-x86_64/mplayer.exe"
const player = require('play-sound')({player: path_to_mplayer, afplay: ['-v', 0.5 ], mplayer: ['-v', 0.5 ]})

// Paths
const path_to_greeting_sounds = process.cwd() + "/resources/sounds/greeting-sounds/"
const path_to_sound_files = process.cwd() + "/resources/sounds/effect/"
const path_to_session = process.cwd() + "/resources/data/sessions/"

var lastGreetTimestamp = 0

// Config File

var content = fs.readFileSync(__dirname+"/config.json");
var config = JSON.parse(content);
var port = config.Port
var serverStatus = config.ServerInitialStatus
const cooldownInMilisecondsForGreet = parseInt(config.GreetCooldown) * 1000
var greetTextTemplates = config.GreetTextTemplates

const greetDuration = 30

/// Greet variables

var greetedList = []
var toGreetList = []

var lastGreetedUser = undefined
var lastUserContent = {user:lastGreetedUser, message:undefined, gif:undefined}

const defaultGifs = ["https://media4.giphy.com/media/FElZNSwKS88GXewzU5/giphy.gif?cid=ecf05e47febkbn4pam08wgf4whytbhnkbyyt8ehwme9zo7j0&rid=giphy.gif",
					"https://media4.giphy.com/media/WT44dsH8TDJhSUkL1o/giphy.gif?cid=ecf05e47h38ei5nn7w3tsrazs1abaezbgvznoawoarwi06rx&rid=giphy.gif",
					"https://media.tenor.com/images/8ae250f7b25379f7abc986c05dca40a3/tenor.gif",
					"https://media.giphy.com/media/EULFnEfOvgRbgKz4D2/giphy.gif"]
const testUser = "test"

module.exports = {

	mountServer: function() {
		loadGreetedList()
	},

	tickServer: function(username) {
		if(serverStatus == "open" || serverStatus == "idle") {
			if(username != null && username != undefined) {
				this.addToGreetQueue(username)
			}
			this.checkForGreet()
		} else {
			console.log("Greet server is closed, ignoring tick")
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
			return res
		}
		return false
	},

	getCurrentGreet: function() {
		if(serverStatus == "open")
		{
			var duration = greetDuration - (Date.now() - lastGreetTimestamp)/1000
			var content = getUserContent()
			return {user:lastGreetedUser, "duration":duration, "gif":content.gif, "message":content.message}
		} else {
			return {user:undefined, duration:undefined, gif:undefined}
		}
	},

	setGif: function(gifUrl) {
		lastGreetedUser = testUser
		lastUserContent.gif = gifUrl
		lastUserContent.message = "Olha a pedra!"
		setGreetActive()
	}
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

		if(!greetedList.includes(userToGreet)) {
			var userSoundFilename = getUserGreetingSoundFilename(userToGreet)
			if(userSoundFilename != undefined) {
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
}

function toggleOpenIdleServer() {
	if(serverStatus == "closed") {
		serverStatus = "open"
	} else if(serverStatus == "idle") {
		serverStatus = "open"
	} else {
		serverStatus = "idle"
	}
}

function closeServer() {
	serverStatus = "closed"
}

function setGreetActive() {
	serverStatus = "open"
	setTimeout(function() {
		toggleOpenIdleServer()
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
	var filename = month + "-" + day + "-" + year + ".txt"
	var fullpath = path_to_session + filename
	return fullpath
}


function getUserGreetingSoundFilename(username) { // returns undefined if user has no sound configured
	var files = fs.readdirSync(path_to_greeting_sounds);
	var filename = undefined
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

function getUserContent() {
	if (lastGreetedUser === lastUserContent.user || lastGreetedUser == testUser) {
		return lastUserContent
	} else {
		lastUserContent.user = lastGreetedUser
		lastUserContent.message = getGreetText(lastGreetedUser) //TODO: let users choose greeting gif
		lastUserContent.gif = defaultGifs[Math.round(Math.random()*defaultGifs.length)]
		return lastUserContent
	}
}

function getGreetText(username)
{
	if(greetTextTemplates != undefined) {
		var textTemplate = greetTextTemplates[Math.round(Math.random())*greetTextTemplates.length]
		if(textTemplate != undefined)
		{
			return textTemplate.replace("<user>", username)
		}
	}
}
