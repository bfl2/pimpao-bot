const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

var port = 8000
var queuel = []
var status = 'closed'


// Config File

var content = fs.readFileSync(__dirname+"/config.json");
var config = JSON.parse(content);
console.log("Config file:")
console.log(config)
var subHasPreference = config.SubHasPreference

const openQueueText = config.OpenQueueText
const closedQueueText = config.ClosedQueueText
module.exports = {

	mountServer: function ()
	{
		status = 'closed';
		queuel = new Array()
		app.listen(port, function() {
			console.log(`app listening on port ${port}!`)
		});
		app.get('/queue', function(req, res) {
			buildHtml()
			res.sendFile(__dirname+"/index.html");
		});
		app.get('/queue/css', (req, res) => {
			res.sendFile(__dirname+"/style.css");
		});
		app.get('/queue/bootstrap', (req, res) => {
			res.sendFile(__dirname+"/bootstrap.min.css");
		});
	},
	openQueue: function()
	{
		status = "open"
	},
	closeQueue: function()
	{
		status = "closed"
	},
	getStatus: function()
	{
		return status
	},
	addToQueue: function(playerName, playerId, isSub)
	{
		return addPlayer(playerName, playerId, isSub)
	},
	getPosByName: function(playerName)
	{
		return getPlayerPos(playerName)
	},
	getFullQueue: function()
	{
		return queuel
	},
	eraseScreen: function()
	{
		status = "hidden"
	},
	cullPlayerList: function(len)
	{
		return removePlayers(len)
	},
	removePlayer: function(pos)
	{
		return removePlayerAtPosition(pos)
	}
}

function getPlayerPos(playerName)
{
	for (var i = 0; i < queuel.length; i++)
	{
		var player = queuel[i]
		if (player.name == playerName)
		{
			return i
		}
	}
	return -1
}

function addPlayer(playerName, playerId, isSub)
{
	var len = 0
	var prefPos = 0
	var found = false
	var player = {"name":playerName, "id":playerId, "subscriber":isSub}
	if (status == "open")
	{
		for (var i = 0; i < queuel.length; i++)
		{
			if (queuel[i].name == player.name)
			{
				editPlayer(i, player.id) // Update Id
				found = true
				break
			}
			else if (player.isSub && !queuel[i].subscriber) // check for preferential position to insert
			{
				prefPos = i
				break
			}
		}
		if (!found)
		{
			len = addPlayer(playerName, playerId, isSub)
			var len = queuel.push(player)
		}
		else if(isSub)
		{
			return insertAtPos(playerName, playerId, isSub)
		}
	}

	return len
}

function editPlayer(index, updatedId)
{
	queuel[index].id = updatedId
}

function insertAtPos(index, playerObj)
{
	queuel.splice(index, 0, playerObj)
	return index
}

function removePlayers(len)
{
	var limitedLen = Math.max(len, queuel.length)
	queuel = queuel.slice(len, queuel.length)
	return queuel.length - limitedLen
}

function removePlayerAtPosition(pos)
{
	if(pos >= 0 && pos <= queuel.length)
	{
		queuel.splice(pos, 1)
		return true
	}
	return false
}

function getFormattedPlayerList(playersLimit, playersHighlightLimit = 10)
{
	var playerList = ""
	var i = 0
	for ( var i =0; i< queuel.length; i++)
	{
		var player = queuel[i]

		var playerElementTemplate =`<tr>
<th scope="row">${i+1}</th>
<td>${player.name}</td>
<td>${player.id}</td>
</tr>
`
		playerList = playerList + playerElementTemplate

		if(i > playersLimit)
		{
			break
		}
	}
	return playerList
}

function openQueueHtml()
{
	const limitPlayers = 20
	var playerList = getFormattedPlayerList(limitPlayers)

	var html =
	`<!DOCTYPE html>
	<html>
		<head>
			<meta http-equiv="Refresh" content="10">
			<link rel="stylesheet" href="http://localhost:${port}/queue/bootstrap">
			<link rel="stylesheet" href="http://localhost:${port}/queue/css">
		</head>
		<body>
		<div class="queue">

		<button class="btn btn-success float-sm-left" type="button" disabled>
		<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
			${openQueueText}
		</button>
			<table class="table table-striped table-dark">
			<thead>
			<tr>
				<th scope="col">#</th>
				<th scope="col">Twitch</th>
				<th scope="col">Dota id</th>
			</tr>
			</thead>
			<tbody>
				${playerList}
			</tbody>
			</table>
		</div>
		</body>
	</html>`

	return html
}

function closedQueueHtml()
{
	const limitPlayers = 20
	var playerList = getFormattedPlayerList(limitPlayers)

	var html =
	`<!DOCTYPE html>
	<html>
		<head>
			<meta http-equiv="Refresh" content="10">
			<link rel="stylesheet" href="http://localhost:${port}/queue/bootstrap">
			<link rel="stylesheet" href="http://localhost:${port}/queue/css">
		</head>
		<body>
		<div class="queue">

		<button class="btn btn-danger float-sm-left" type="button" disabled>
			${closedQueueText}
		</button>
			<table class="table table-striped table-dark">
			<thead>
			<tr>
				<th scope="col">#</th>
				<th scope="col">Twitch</th>
				<th scope="col">Dota id</th>
			</tr>
			</thead>
			<tbody>
				${playerList}
			</tbody>
			</table>
		</div>
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
			<link rel="stylesheet" href="http://localhost:${port}/queue/css">
		</head>
		<body>
			<div class="queue-container">
				<p>###1d</p>
			</div>
		</body>
	</html>`

	return html
}

function buildHtml()
{
	switch(status)
	{
		case "open":
			var html = openQueueHtml()
			break;
		case "closed":
			var html = closedQueueHtml()
			break;
		case "hidden":
			var html = emptyHtml()
			break;
		default:
			var html = emptyHtml()
			break;
	}

	fs.writeFileSync(__dirname + "/index.html", html)
}