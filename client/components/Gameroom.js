import React, {Component} from 'react'
import db from '../../firestore.js'
import Chat from './chat'
import Lobby from './lobby'
import Canvas from './canvas'
import {Link} from 'react-router-dom'
import Timer from './canvas/Timer'

export default class Gameroom extends Component {
  constructor() {
    super()
    this.state = {
      username: localStorage.getItem('username'),
      canvasData: []
    }
    this.handleUpdate = this.handleUpdate.bind(this)
  }
  async componentDidMount() {
    try {
      const gameRoomId = localStorage.getItem('room') //location.pathname.slice(1)
      const currentGame = await db.collection('rooms').doc(gameRoomId)
      const currentGameGet = await db
        .collection('rooms')
        .doc(gameRoomId)
        .get()
      const currentGameData = currentGameGet.data()
      let currentTimer = currentGameData.timer
      let currentRound = currentGameData.round
      if (currentGameData.playerCount > 0) {
        setInterval(() => {
          if (currentTimer > -1) {
            if (currentTimer === 0) {
              currentGame.update({
                timer: currentTimer--
              })
            }
          }
        }, 1000)
      }
    } catch (err) {
      console.log(err)
    }
  }
  handleUpdate() {
    this.setState({
      canvasData: [1, 2, 3]
    })
  }
  render() {
    return (
      <div>
        <div className="timer">
          <Timer />
        </div>
        <div className="lobbybox">
          <Lobby roomId={this.props.match.params.gameroom} />
        </div>
        <div className="canvas">
          <Canvas canvasData={this.state.canvasData} />
        </div>
        <div className="chatbox">
          <Chat
            roomId={this.props.match.params.gameroom}
            username={this.state.username}
          />
        </div>
        <Link to="/">Home</Link>
      </div>
    )
  }
}
