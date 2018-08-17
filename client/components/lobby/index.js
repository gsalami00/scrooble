import PlayerCard from './PlayerCard'
import React, {Component} from 'react'
import db from '../../../firestore'

export default class Lobby extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: []
    }
  }
  async componentDidMount() {
    let playerArr = []
    const players = await db
      .collection('rooms')
      .doc(this.props.roomId)
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
    const roomInstance = await db
      .doc(`rooms/${location.pathname.slice(1)}`)
      .get()
    const dbPlayerCount = roomInstance.data().playerCount
    await db.doc(`rooms/${location.pathname.slice(1)}`).update({
      playerCount: dbPlayerCount + 1
    })
    this.setState({
      players: playerArr
    })
  }

  render() {
    const allPlayers = this.state.players
    return (
      <React.Fragment>
        {/* <div>Map over playercards</div> */}
        {allPlayers.map((player, idx) => {
          return (
            <div className="playercard" key={idx}>
              <PlayerCard name={player} />
            </div>
          )
        })}
      </React.Fragment>
    )
  }
}
