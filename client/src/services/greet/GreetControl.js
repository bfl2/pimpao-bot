import React from 'react'
import Greet from './Greet'
import { Link } from 'react-router-dom';
import ContinuousSlider from '../../components/Slider'
import { TextField, Button } from '@material-ui/core';
import constants from '../../common/constants.js'
import axios from 'axios'


const endpoint = "api/greet/test"

class GreetControl extends React.Component {

	constructor(props) {
		super(props)
		this.setGifRequest = this.setGifRequest.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			gifUrl: ""
		};
	}

	setGifRequest() {
		var apiUrl = constants.apiBaseUrl + endpoint
		axios.post(apiUrl, { gif:this.state.gifUrl })
		.then(data => {
			console.log(data)
		});
	}

	handleChange({ target }) {
		this.setState({
		  [target.name]: target.value
		});
	  }


	render() {
		return <div>
				<Link to="/">Home</Link>
				<ContinuousSlider></ContinuousSlider>
				<p>Greet Control</p>
				<p>test gif</p>
				<TextField type="text"
					name="gifUrl"
					placeholder="Place gif link here"
					onChange={ this.handleChange }></TextField>
				<Button onClick={() => this.setGifRequest('James') }> Test Gif</Button>
				<Greet></Greet>

			</div>
	}
}

export default GreetControl
