import React, {Component} from 'react'
import db from '../../firestore.js'
import {forEach} from '@firebase/util'
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
    const canvasInstance = await db
      .collection('rooms')
      .doc(location.pathname.slice(1))
      .collection('drawings')
      .doc('5TBBhPQ69Oa3HmfkwCIa')
    // canvasInstance.onSnapshot(snapshot => {
    //   let dataArray = snapshot.data().canvasData
    //   this.setState({
    //     canvasData: [dataArray[dataArray.length - 1]]
    //   })
    // })
    const currentGame = await db
      .collection('rooms')
      .doc(location.pathname.slice(1))
    const currentGameGet = await db
      .collection('rooms')
      .doc(location.pathname.slice(1))
      .get()

    const currentGameData = currentGameGet.data()
    let currentTimer = currentGameData.timer
    let currentRound = currentGameData.round
    if (currentGameData.playerCount > 0) {
      setInterval(() => {
        if (currentTimer > -1) {
          if (currentTimer === 0) {
            console.log('Current Round:', currentRound)
            currentGame.update({
              round: ++currentRound
            })
            console.log('Next Round:', currentRound)
          }
          console.log(currentTimer)
          currentGame.update({
            timer: currentTimer--
          })
        }
      }, 1000)
    }
  }
  handleUpdate() {
    this.setState({
      canvasData: [1, 2, 3]
    })
  }
  render() {
    console.log(this.state.canvasData)
    return (
      <div>
        <Link to="/">Home</Link>
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
          <Chat roomId={this.props.match.params.gameroom} />
        </div>
      </div>
    )
  }
}
