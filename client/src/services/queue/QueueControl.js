import React from 'react'
import Queue from './Queue'
import { Link } from 'react-router-dom'

class QueueControl extends React.Component {
	render() {
		return <div>
				<Link to="/">Home</Link>
				<p>Queue Control</p>
				<Queue></Queue>
			</div>
	}
}

export default QueueControl;