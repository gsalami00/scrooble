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
    let playerArr = []
    const players = await db
      .collection('rooms')
      .doc(this.roomId)
      .collection('players')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(player => {
          playerArr.push(player.data().username)
        })
      })
      .catch(err => {
        console.log('Error geting documents: ', err)
      })
    this.setState({
      players: playerArr
    })
  }
  render() {
    const allPlayers = this.state.players
    return (
      <React.Fragment>
        {allPlayers.map((player, idx) => {
          return (
            <div className="playercard" key={idx}>
              <PlayerCard name={player[1]} score={player[2]} />
            </div>
          )
        })}
      </React.Fragment>
    )
  }
}
