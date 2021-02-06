import React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '@material-ui/core'
import './css/Home.css'


class Home extends React.Component {
  render() {
    return <div className="App">
        <p>
          Modules
        </p>
        <Breadcrumbs class="breadcrumb-container" aria-label="breadcrumb">
        <Link color="inherit" to="/greet">Greet</Link>
        <Link color="inherit" to="/gifspanel">Gifs</Link>
        <Link color="inherit" to="/queue">Queue</Link>
        <Link color="inherit" to="/quiz">Quiz</Link>
      </Breadcrumbs>

      <Breadcrumbs class="breadcrumb-container" aria-label="breadcrumb">
       <Link color="inherit" to="/greet/control">Greet Control</Link>
       <Link color="inherit" to="/gifspanel/control">Gifs Control</Link>
       <Link color="inherit" to="/queue/control">Queue Control</Link>
       <Link color="inherit" to="/quiz/control">Quiz Control</Link>
      </Breadcrumbs>

    </div>
  };
}

export default Home
