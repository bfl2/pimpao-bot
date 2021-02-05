import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './css/index.css'
import App from './App'

import Greet from './services/greet/Greet'
import GreetControl from './services/greet/GreetControl'
import Queue from './services/queue/Queue'
import QueueControl from './services/queue/QueueControl'
import Quiz from './services/quiz/Quiz'
import QuizControl from './services/quiz/QuizControl'


import * as serviceWorker from './serviceWorker'

ReactDOM.render(
   <BrowserRouter>
        <Switch>
            <Route path="/" exact={true} component={App} />
            <Route path="/greet" component={Greet} exact={true}/>
            <Route path="/greet/control" component={GreetControl}/>
            <Route path="/queue" component={Queue} exact={true}/>
            <Route path="/queue/control" component={QueueControl} />
            <Route path="/quiz" component={Quiz} exact={true}/>
            <Route path="/quiz/control" component={QuizControl} />
        </Switch>
    </ BrowserRouter>,
  document.getElementById('root')
);

serviceWorker.register()
