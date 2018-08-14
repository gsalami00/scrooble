'use strict'

import React, {Component} from 'react'
import db from '../../../firestore.js'

export default class Timer extends Component {
  constructor() {
    super()
    this.state = {
      time: 5,
      start: false
    }
    this.countdown = this.countdown.bind(this)
  }

  componentDidMount() {
    this.countdown()
  }

  countdown() {
    let currTime = this.state.time
    setInterval(() => {
      if (currTime > -1) {
        this.setState({
          time: currTime--
        })
      }
    }, 1000)
  }

  render() {
    return <div className="timer-text">
    {this.state.time}
    </div>
  }
}
