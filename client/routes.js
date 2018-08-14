import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'

import {Homepage, Gameroom} from './components'
import GameroomFinder from './components/main/index.js'
import UsernameDecider from './components/main/UsernameDecider.js'
import ChooseWordPrompt from './components/canvas/ChooseWordPrompt'

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/word-prompt" component={ChooseWordPrompt} />
        <Route exact path="/gameroomfinder" component={GameroomFinder} />
        <Route exact path="/username-decider" component={UsernameDecider} />
        <Route exact path="/:gameroom" component={Gameroom} />
        <Route exact path="/" component={Homepage} />
      </Switch>
    )
  }
}
