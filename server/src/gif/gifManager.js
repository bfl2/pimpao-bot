const fs = require('fs');


// Load content from gif list file

var gifListfilepath = __dirname+"\\..\\..\\resources\\data\\gifs\\userGifs.data"
if (!fs.existsSync(gifListfilepath)) { // create empty file if it does not exist
	fs.writeFileSync(gifListfilepath, "")
}

var content = fs.readFileSync(gifListfilepath)
if (content.length < 15) {
	userGifs = []
} else {
	var userGifs = JSON.parse(content)
}


module.exports = {

	setUserGif: function(username, gifURL) {
		var urlSanitized = gifURL // Replace//sanitizeURL(gifURL)
		if (userHasGif(username)) {
			updateUserGif(username, urlSanitized)
		} else {
			addUserGif(username, urlSanitized)
		}
		updateLocalGifList()
	},
	getUserGifs: function() {
		return userGifs
	},
	validateUserGif: function(username, validateFlag) {
		if (userHasGif(username)) {
			for (var i = 0; i < userGifs.length; i++) {
				if (userGifs[i].username === username) {
					userGifs[i].validated = validateFlag
					break
				}
			}
			updateLocalGifList()
		}
	}
}

function updateLocalGifList() {
	var content = JSON.stringify(userGifs)
	fs.writeFileSync(gifListfilepath, content)
}

function userHasGif(username) {
	return userGifs.some(e => e.username === username)
}

function updateUserGif(username, gifURL) {
	for (var i = 0; i < userGifs.length; i++) {
		if (userGifs[i].username === username) {
			userGifs[i].gif = gifURL
			userGifs[i].validated = false
			break
		}
	}
}

function addUserGif(username, gifURL) {
	var userGif = {"username":username, gif:gifURL, validated:false}
	userGifs.push(userGif)
}

function sanitizeURL(url) {
	const unsupportedChars = ["\\", ",", ">", "<", " "]
	var sanUrl = url
	unsupportedChars.forEach(char => {
		sanUrl = sanUrl.replace(char, "")
	})
	return sanUrl
}