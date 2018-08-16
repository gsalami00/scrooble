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
  }

  async componentDidMount() {
    this.countdown()
    this.roomInstanceInfo = await db.doc(`rooms/${this.roomId}`).get()
    this.time = this.roomInstanceInfo.data().timer
  }

  countdown() {
    setInterval(async () => {
      if (this.time > 0) {
        this.time--
        await db.doc(`rooms/${this.roomId}`).update({
          timer: this.time
        })
        this.setState({
          time: this.time
        })
      }
    }, 1000)
  }

  render() {
    return <div className="timer-text">{this.state.time}</div>
  }
}
