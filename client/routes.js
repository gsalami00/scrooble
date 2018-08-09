import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import {Homepage, Gameroom, Canvas} from './components'
import Messages from './components/chat/Messages'

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/canvas" component={Canvas} />
        <Route path="/:roomId" component={Gameroom} />

        <Route exact path="/" component={Homepage} />

        {/* <Route exact path="/game" component={Messages} /> */}
      </Switch>
    )
  }
}
export default Routes
