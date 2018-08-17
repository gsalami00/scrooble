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
    this.roomId = '6CKavy7w3KGZf5hYdZa6' //location.pathname.slice(1)
    this.roomInstanceInfo = ''
    this.roomInstance = ''
    this.leaveGame = this.leaveGame.bind(this)
    this.decrementPlayerCount = this.decrementPlayerCount.bind(this)
    // this.getUpdatedRoomInstance = this.getUpdatedRoomInstance.bind(this)
  }
  async componentDidMount() {
    try {
      window.onbeforeunload = async event => {
        event.preventDefault()
        // this.roomInstance = await db
        //   .doc(`rooms/${location.pathname.slice(1)}`)
        //   .get()
        await db
          .doc(`rooms/${this.roomId}/players/${this.state.username}`)
          .delete()
        await this.decrementPlayerCount()
        event.returnValue = `\o/`
      }

      const currentGame = await db.collection('rooms').doc(this.roomId)
      this.roomInstanceInfo = await db
        .collection('rooms')
        .doc(this.roomId)
        .get()
      const currentGameData = this.roomInstanceInfo.data()
      let currentTimer = currentGameData.timer
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
  async decrementPlayerCount() {
    const playersCollectionInfo = await db
      .collection(`rooms/${this.roomId}/players`)
      .get()

    // const dbPlayerCount = this.roomInstance.data().playerCount
    // const subtractedCount = dbPlayerCount - 1
    // await db.doc(`rooms/${this.roomId}`).update({
    //   playerCount: subtractedCount
    // })
  }
  async leaveGame(event) {
    event.preventDefault()
    // this.getUpdatedRoomInstance()
    // const dbPlayerCount = this.getUpdatedRoomInstance.data().playerCount

    // await db.doc(`rooms/${this.roomId}`).update({
    //   playerCount: dbPlayerCount - 1
    // })

    await db.doc(`rooms/${this.roomId}/players/${this.state.username}`).delete()

    // console.log('roominstanceinfo', this.roomInstanceInfo.data())
    // const updatedRoomInstanceInfo = await db
    //   .collection('rooms')
    //   .doc(this.roomId)
    //   .get()
    // let turnOrderArray = updatedRoomInstanceInfo.data().turnOrder
    // if (turnOrderArray.includes(this.state.username)) {
    //   const idx = turnOrderArray.indexOf(this.state.username)
    //   console.log(turnOrderArray, 'TURN ORDER ARRAY')
    //   turnOrderArray.splice(idx, 1)
    //   console.log(turnOrderArray, 'SPLICED')
    //   await db.doc(`rooms/${this.roomId}`).update({
    //     turnOrder: [...turnOrderArray]
    //   })
    // }
    event.returnValue = `\o/`
  }
  componentWillUnmount() {
    // window.removeEventListener('onbeforeunload', this.leaveGame)
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
