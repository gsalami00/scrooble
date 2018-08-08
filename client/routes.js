import React, {Component} from 'react'
import {Homepage} from './components'
import {Route, Switch} from 'react-router-dom'
import Messages from './components/chat/Messages'

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/game" component={Messages} />
        {/* Messages isn't right component; needs to eventually be fixed, leave for now so stuff can be tested */}
      </Switch>
    )
  }
}
export default Routes
