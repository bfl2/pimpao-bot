import React, { Component } from "react"
import Container from '@material-ui/core/Container'
import '../../css/greet.css'
import constants from '../../common/constants.js'


const endpoint = "api/greet"
const updateDelayInSeconds = 1

class Greet extends Component {

	constructor(props) {
		super(props);
		this.state = {
			greetGif:"",
			greetPlayer:"",
			greetMessage:"",
			isGreetVisible:false
		};
	}

	getData = () => {
		const apiUrl = constants.apiBaseUrl + endpoint
		fetch(apiUrl)
			.then(response => response.json())
			.then(data => {
				console.log(data)
				if(data!==undefined && data.gif!==undefined) {
					this.setState(
					{
						greetGif:data.gif,
						greetPlayer:data.user,
						greetMessage:data.message,
						isGreetVisible:true
					}
					);
				} else {
					this.setState(
					{
						isGreetVisible:false
					}
					);
				}
			});

	}

	componentDidMount() {
		this.getData()
		this.intervalID = setInterval(
			() => this.getData(),
			updateDelayInSeconds * 1000
		);
	}

	componentWillUnmount() {
		clearTimeout(this.intervalID);
	}

	render() {
		return (
		<div style={{width:"100vw", height:"100vh"}}>
			<Container style={{alignContent:"center", display:(this.state.isGreetVisible?"":"none")}}>
				<div class="bubble bubble-bottom-left" style={{float:"right"}}> {this.state.greetMessage} {this.state.greetPlayer} </div>
				<img src={this.state.greetGif} alt=""></img>
			</Container>
		</div>
		)
	}
}

export default Greet;
