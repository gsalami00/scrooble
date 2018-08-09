import PlayerCard from './PlayerCard'
import React, {Component} from 'react'

export default class Lobby extends Component {
  constructor() {
    super();
    this.state = {

    }
  }
  render() {
    return (
      <React.Fragment>
        <div>Map over playercards</div>
        <PlayerCard />
        </React.Fragment>
    )
  }
}
