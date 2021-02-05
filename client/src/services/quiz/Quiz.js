import React from 'react'
import ContentBox from './components/ContentBox'
import '../../css/common.css'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import { motion } from "framer-motion"

class Quiz extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			quiz: [],
			user: "teste",
			status: "hidden"
		};
	}

	getData = () => {
		console.log("get data")
		const apiUrl = "http://www.localhost:8080/quiz/api"
		fetch(apiUrl)
			.then(response => response.json())
			.then(data => {
				console.log(data)
			this.setState(
				{
					quiz:data.quiz,
					user: data.user,
					status:data.status
				}
			);
		});

	}

	componentDidMount() {
		this.getData()
		this.intervalID = setInterval(
			() => this.getData(),
			10000
		  );
	  }

	componentWillUnmount() {
		clearTimeout(this.intervalID);
    }

	render() {
		let isVisible = true
		//let isVisible = this.state.status!="hidden"
		const Wrapper = styled.div`
		padding: 2em;
		background: ivory;
		`;

	return <Wrapper {...(!isVisible && { hidden: !isVisible })}>
		<motion.div layout
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{duration: 2}}>
			<Grid container direction="row" spacing={1} item xs={12}>
				<Grid container direction="column" xs={12}>
					<Grid xs={6}>
						<ContentBox content={this.state.status} color="red"/>
						<ContentBox content={this.state.quiz.question} color="red"/>
						<ContentBox content={this.state.user} color="red"/>
					</Grid>
					<Grid xs={6}>
						<ContentBox color="blue"/>
					</Grid>

				</Grid>
			</Grid>
		</motion.div>
	</Wrapper>
	}
}

export default Quiz;
