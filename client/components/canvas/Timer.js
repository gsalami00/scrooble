'use strict'

import React, {Component} from 'react'
import db from '../../../firestore.js'

export default class Timer extends Component {
  constructor() {
    super()
    this.state = {
      time: 60,
      start: false
    }
    this.countdown = this.countdown.bind(this)
    this.time = -Infinity
    this.roomId = location.pathname.slice(1)
    this.roomInstanceInfo = ''
    this.username = localStorage.getItem('username')
  }

  async componentDidMount() {
    this.countdown()
    this.roomInstanceInfo = await db.doc(`rooms/${this.roomId}`).get()
    this.time = this.roomInstanceInfo.data().timer
    this.turnOrderArray = this.roomInstanceInfo.data().turnOrderArray
  }

  async countdown() {
    // const currentGame = await db.collection('rooms').doc(this.roomId)
    // this.roomInstanceInfo = await db
    //   .collection('rooms')
    //   .doc(this.roomId)
    //   .get()
    // const currentGameData = this.roomInstanceInfo.data()
    // let currentTimer = currentGameData.timer
    let players = []
    const playerCollectionInfo = await db
      .collection(`rooms/${this.roomId}/players`)
      .get()
    playerCollectionInfo.docs.forEach(player => {
      players.push(player.id)
    })
    if (players.length === 2) {
      await db.doc(`rooms/${this.roomId}`).update({
        startTimer: true
      })
    }

    setInterval(async () => {
      if (this.time > 0 && players.length > 1) {
        this.time--
        // if (players[0] === this.username) {
        await db.doc(`rooms/${this.roomId}`).update({
          timer: this.time
        })
        // }
        this.setState({
          time: this.time
        })
      } else {
        const unsubscribe = await db
          .doc(`rooms/${this.roomId}`)
          .onSnapshot(room => {
            if (room.data().startTimer) {
              unsubscribe()
              this.countdown()
            }
          })
      }
    }, 1000)
  }

  render() {
    return <div className="timer-text">{this.state.time}</div>
  }
}
