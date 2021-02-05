import React from 'react';
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography';


class ContentBox extends React.Component {
	render() {
		const Wrapper = styled.div`
		background: ${this.props.color};
		float: left;
		border-radius: 20px;
		padding: 10px;
		margin: 10px;
		box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
		`;
	return	<Wrapper>
		<Typography color='textSecondary' variant='h3' align='center'>
		{this.props.content}
		</Typography>
	</Wrapper>
	}
}

export default ContentBox;