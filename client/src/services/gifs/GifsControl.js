import React from 'react'
import GifsPanel from './GifsPanel'
import { Link } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core';
import constants from '../../common/constants.js'
import axios from 'axios'


const endpoint = "api/gifs/validated"

class GifsControl extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return <div>
				<Link to="/">Home</Link>
				<p>Gif Control</p>
				<GifsPanel showNames={true} requireValidation={false}></GifsPanel>
			</div>
	}
}

export default GifsControl
