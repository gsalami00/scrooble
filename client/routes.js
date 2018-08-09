import React, {Component} from 'react'
import {Homepage} from './components'
import {Route, Switch} from 'react-router-dom'
import Game from './components/main'

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/game" component={Game} />{' '}
        {/* soon to be '/:game' */}
      </Switch>
    )
  }
}
export default Routes
