import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import {Homepage, Gameroom} from './components'
import GameroomFinder from './components/main/index.js'

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/gameroomfinder" component={GameroomFinder} />
        <Route exact path="/:gameroom" component={Gameroom} />
        <Route exact path="/" component={Homepage} />
      </Switch>
    )
  }
}
