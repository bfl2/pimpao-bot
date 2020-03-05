const player = require('play-sound')()
const fs = require('fs')
const path = require('path')

const directoryPath = path.join(__dirname, '../media');

module.exports = {

	playUserGreeting :function (username) {
		var userAudio = getUserSound(username)
		if (userAudio != "") {
			player.play( directoryPath+"/"+userAudio, function(err) {
				if (err) {
					console.log("failed to play sound: "+ userAudio)
					throw err
					return "error" // could not play sound due to internal error
				}
			})
			return "done" // sound was played
		} else {
			return "not found" // user does not have an audio file
		}
	},

	playGenericSound: function (audioName) {
		player.play(directoryPath+"/"+audioName, function(err){
			if (err) {
				throw err
			} else {
				return true // sound was played
			}
		})
		return false // sound was not played
	}

}

function getUserSound(username) {
	var files = fs.readdirSync(directoryPath, function (err, files) {
		//handling error
		if (err) {
			console.log('Unable to scan directory: ' + err)
			return []
		}
		//listing all files using forEach
		return files
	})
	var fileName = ""
	files.forEach(function (file) {
		if(file.toLowerCase().includes(username.toLowerCase()))
		{
			console.log("		Found mp3 file:" + file)
			fileName = file
		}
	})

	return fileName
}

