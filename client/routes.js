import React, { Component } from 'react'
import {Homepage} from './components'
import { Route, Switch} from 'react-router-dom'

class Routes extends Component {
  render(){
    return(
      <Switch>
        <Route exactpath="/" component={Homepage} />
        </Switch>
    )
  }
}
 export default Routes
