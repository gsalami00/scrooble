'use strict'

import React, {Component} from 'react'
import db from '../../../firestore.js'

export default class Canvas extends Component {
  constructor() {
    super()

    this.canvasData = []
    this.record = false
    this.roomId = location.pathname.slice(1)
    this.username = localStorage.getItem('username')
    this.turnOrderArray = []
    this.drawingDocId = ''
    this.time = ''
    this.roomInstanceInfo = ''

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.startNewRound = this.startNewRound.bind(this)
    this.getDrawing = this.getDrawing.bind(this)
    this.startTurnCountdown = this.startTurnCountdown.bind(this)
  }
  async componentDidMount() {
    const drawingCollectionInfo = await db
      .collection(`rooms/${this.roomId}/drawings`)
      .get()
    if (drawingCollectionInfo.empty) {
      await db.collection(`rooms/${this.roomId}/drawings`).add({
        canvasData: []
      })
    }
    this.drawingDocId = drawingCollectionInfo.docs[0].id

    this.roomInstanceInfo = await db.doc(`rooms/${this.roomId}`).get()
    this.time = this.roomInstanceInfo.data().timer
    if (!this.roomInstanceInfo.data().turnOrder) this.startNewRound()
  }
  async startNewRound() {
    const playersCollectionInfo = await db
      .collection(`rooms/${this.roomId}/players/`)
      .get()
    const turnArray = []
    playersCollectionInfo.forEach(player => turnArray.push(player.id))
    await db.doc(`rooms/${this.roomId}`).update({
      turnOrder: [...turnArray]
    })
    this.turnOrderArray = [...this.roomInstanceInfo.data().turnOrder]
    await this.startTurnCountdown()
  }
  drawCanvas(start, end, strokeColor = 'black') {
    const ctx = this.theCanvas.getContext('2d')
    ctx.beginPath()
    ctx.strokeStyle = strokeColor
    ctx.moveTo(...start)
    ctx.lineTo(...end)
    ctx.closePath()
    ctx.stroke()
  }
  startTurnCountdown() {
    let milliseconds = this.time * 1000
    setTimeout(async () => {
      this.turnOrderArray.shift()
      await db.doc(`rooms/${this.roomId}`).update({
        turnOrder: [...this.turnOrderArray]
      })
    }, milliseconds)
    if (!this.roomInstanceInfo.data().turnOrder) this.startNewRound()
  }
  handleMouseDown() {
    let myTurn = this.username === this.turnOrderArray[0]
    if (myTurn) this.record = true
    console.log(
      'TURN, username, this.turnOrderArray',
      myTurn,
      this.username,
      this.turnOrderArray[0]
    )
  }
  handleMouseMove(event) {
    event.persist()
    if (this.record) {
      const latestPoint = {
        x: event.pageX - this.theCanvas.offsetLeft,
        y: event.pageY - this.theCanvas.offsetTop,
        strokeColor: 'black',
        lineWidth: 3,
        lineEnd: false
      }

      this.canvasData.push(latestPoint)

      this.canvasData.forEach((point, idx, arr) => {
        if (idx > 0 && idx < arr.length && arr[idx - 1].lineEnd === false) {
          let startX = arr[idx - 1].x
          let startY = arr[idx - 1].y
          let endX = point.x
          let endY = point.y
          this.drawCanvas(
            [startX, startY],
            [endX, endY],
            point.strokeColor,
            point.lineEnd
          )
        }
      })
    }
  }
  async handleMouseUp() {
    let myTurn = this.username === this.turnOrderArray[0]
    if (this.canvasData.length && myTurn) {
      let endDraw = this.canvasData[this.canvasData.length - 1]
      endDraw.lineEnd = true
      this.canvasData.push(endDraw)
      this.record = false
      await db
        .doc(`rooms/${this.roomId}/drawings/${this.drawingDocId}`)
        .update({
          canvasData: [...this.canvasData]
        })
    }
  }
  async getDrawing() {
    let myTurn = this.username === this.turnOrderArray[0]
    if (!myTurn) {
      await db
        .doc(`rooms/${this.roomId}/drawings/${this.drawingDocId}`)
        .onSnapshot(doc => {
          let canvasData = doc.data().canvasData
          canvasData.forEach((point, idx, arr) => {
            if (idx > 0 && idx < arr.length && arr[idx - 1].lineEnd === false) {
              let startX = arr[idx - 1].x
              let startY = arr[idx - 1].y
              let endX = point.x
              let endY = point.y
              this.drawCanvas(
                [startX, startY],
                [endX, endY],
                point.strokeColor,
                point.lineEnd
              )
            }
          })
        })
    }
  }
  render() {
    return (
      <div
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseOut={this.handleMouseUp}
        onClick={this.getDrawing}
      >
        {/* {this.turnOrderArray[0] === this.username ? null : (
          <button className="join-btn" type="button" onClick={this.getDrawing}>
            Join
          </button>
        )} */}
        <canvas
          ref={canvas => (this.theCanvas = canvas)}
          height={500}
          width={500}
        />
      </div>
    )
  }
}
