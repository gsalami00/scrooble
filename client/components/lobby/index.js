import PlayerCard from './PlayerCard'
import React, {Component} from 'react'
import db from '../../../firestore'

export default class Lobby extends Component {
  constructor() {
    super()
    this.roomId = location.pathname.slice(1)
    this.state = {
      players: []
    }
  }
  async componentDidMount() {
    try {
      let playerArr = []
      let idx = this.state.players.length
      this.listener = await db
        .collection('rooms')
        .doc(this.roomId)
        .collection('players')
        .onSnapshot(async querySnapshot => {
          querySnapshot.forEach(player => {
            idx++
            playerArr.push([idx, player.data().username])
          })
          if (playerArr.length) {
            await this.setState({
              players: playerArr
            })
          }
          playerArr = []
        })
    } catch (err) {
      console.log(err)
    }
  }
  render() {
    const allPlayers = this.state.players
    return (
      <React.Fragment>
        {allPlayers.map(player => {
          console.log('player is', player)
          return (
            <div className="playercard" key={player[0]}>
              <PlayerCard name={player[1]} />
            </div>
          )
        })}
      </React.Fragment>
    )
  }
}
