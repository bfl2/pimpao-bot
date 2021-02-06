import React from 'react'
import axios from 'axios'
import Container from '@material-ui/core/Container'
import constants from '../../common/constants.js'

const endpoint = "api/gifs"
const serverFetchDelay = 60
class GifsPanel extends React.Component {

	constructor() {
		super()
		this.state = {
			gifList: [],
			isVisible: true
		 }
	}

	async componentDidMount() {
		await this.getData();

		this.intervalId = setInterval(() => {
			this.getData();
		}, 1000 * serverFetchDelay)
	}


	componentWillUnmount() {
		clearInterval(this.intervalId)
	}

	setValidation(username) {
		var flagToSet = false
		if (this.props.requireValidation === undefined) {
			flagToSet = true
		} else {
			flagToSet = !this.props.requireValidation
		}
		var validateEndpoint = "api/gifs/validate"
		var apiUrl = constants.apiBaseUrl + validateEndpoint
		axios.post(apiUrl, { 'username':username, validate:flagToSet })
		.then(data => {
			console.log(data)
		});
	}

	setGifRequest() {
		var apiUrl = constants.apiBaseUrl + endpoint
		axios.post(apiUrl, { gif:this.state.gifUrl })
		.then(data => {
			console.log(data)
		});
	}

	getData = () => {
		const apiUrl = constants.apiBaseUrl + endpoint
		fetch(apiUrl)
			.then(response => response.json())
			.then(data => {
				console.log(data)
				if(data!==undefined) {
					console.log(this.props)
					if(this.props.hasOwnProperty('requireValidation') && this.props.requireValidation !== undefined) {
						data = filterList(data, this.props.requireValidation)
					} else {
						data = filterList(data, true)
					}
					var positionedData = positionList(data)
					console.log(positionedData)
					this.setState(
					{
						gifList:positionedData,
						isVisible:true
					}
					)
				} else {
					this.setState(
					{
						gifList:[],
						isVisible:false
					}
					);
				}
			});
	}

	render() {
		const showNames = this.props.showNames
		return <Container hidden={!this.state.isVisible}>
			<div >
			{this.state.gifList.map(item => (
				<div key={item.username} onClick={() => this.setValidation(item.username)} style={{position:"absolute", left:item.x, top:item.y}}>
					<div>
						{showNames?<p style={{textAlign:"center"}}>{item.username}</p>:""}
						<img src={item.gif} alt=""></img>
					</div>
				</div>
			))}
			</div>

	</Container>
	}
}

export default GifsPanel

function positionList(data) {
	var positions = getRandomPositionSet(data.length)
	for (var i = 0; i < data.length; i++) {
		data[i]["x"] = positions[i].x.toFixed(2) + "%"
		data[i]["y"] = positions[i].y.toFixed(2) + "%"
	}
	console.log(data)
	return data;
}

function filterList(data, isValidationRequired) {
	var filteredList = data.filter(obj => obj.validated === isValidationRequired)
	console.log("filt", filteredList)
	return filteredList
}

function getRandomPositionSet(size) {
	var positions = []
	var minDist = 100/size
	for(var i = 0; i < size; i++) {
		var coords = generateCoordsAboveDist(positions, minDist)
		positions.push(coords)
	}
	return positions
}

function generateCoordsAboveDist(setCoords, minDist) {
	var aboveMinDist = false
	var ITER_LIMIT = 1000
	var iterations = 0
	while (!aboveMinDist) {
		var x = getRandomNumberInRange(5, 95)
		var y = getRandomNumberInRange(10, 90)
		for (var i = 0; i<setCoords.length; i++) {
			var dist = Math.sqrt(Math.pow((setCoords[i].x - x), 2) + Math.pow((setCoords[i].y - y), 2))
			if (dist < minDist) {
				break
			}
			if (i === setCoords.length) { //All points above min dist
				aboveMinDist = true
			}
		}
		iterations++
		if (iterations > ITER_LIMIT) {
			break
		}
	}
	return {'x':x, 'y':y}
}

function getRandomNumberInRange(min, max) {
	return Math.random()*(max-min) + min
}