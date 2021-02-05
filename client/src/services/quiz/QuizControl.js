import React from 'react';
import Quiz from './Quiz'
import { Link } from 'react-router-dom';

class QuizControl extends React.Component {
	render() {
		return <div>
				<Link to="/">Home</Link>
				<p>Quiz Control</p>
				<Quiz></Quiz>
			</div>
	}
}

export default QuizControl;