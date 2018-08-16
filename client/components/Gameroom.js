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
  }
  async componentDidMount() {
    try {
      const gameRoomId = localStorage.getItem('room')
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
    // The choose word prompt should appear if it's the player's turn (if the player in localstorage matches the first player in the array)
    // at the end of the turn, pop the player from the array
    // how to handle the next turns: componentDidUpdate?
    // also in the componentDidUpdate: getting chat messages from firebase
    // Suggestion: when round is 1 more then a multiple of 3, it's a new round
  }
  render() {
    return (
      <div>
        <div className="timer">
          <Timer />
        </div>
        <div className="lobbybox">
          <Lobby />
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
