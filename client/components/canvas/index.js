'use strict'

/**
 * Creates a whiteboard on the page that the user can scribble on.
 *
 * Exports:
 *   - default draw(from, to, color, shouldBroadcast)
 *   - events: an EventEmitter that emits `draw` events.
 */
import React, {Component} from 'react'
import CanvasDraw, {drawLine} from 'react-canvas-draw'
import db from '../../../firestore.js'

export default class Canvas extends Component {
  constructor() {
    super()
    this.state = {
      color: '#000',
      size: 6,
      x: 0,
      y: 0,
      width: 400,
      height: 400,
      record: false
    }
    this.canvasData = []
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    // this.tempCanvas = this.tempCanvas.bind(this)
  }
  componentDidMount() {}
  handleMouseDown() {
    this.setState({
      record: true
    })
  }

  async handleMouseMove(event) {
    event.persist()
    if (this.state.record) {
      const currentRoomId = location.pathname.slice(1)
      const roundList = await db
        .collection('rooms')
        .doc(currentRoomId)
        .collection('drawings')
        .get()
      const currentRoundIndex = roundList.docs.length - 1
      const drawings = await db
        .collection('rooms')
        .doc(currentRoomId)
        .collection('drawings')
        .get()
      // const currentRoundDrawingId = drawings.docs[currentRoundIndex].id
      // // const currentRoundDrawingCanvasRef = await db.ref(
      // //   `rooms/${currentRoomId}/drawings/${currentRoundDrawingId}`
      // // )
      // const res = await db
      //   .collection('rooms')
      //   .doc(currentRoomId)
      //   .collection('drawings')
      //   .doc(currentRoundDrawingId)
      //   .get()
      // const canvasData = res.data().canvasData

      this.canvasData.push({
        x: event.clientX,
        y: event.clientY,
        size: this.state.size,
        color: this.state.color
      })

      // console.log(this.canvasData)

      const currentDrawingInstance = await db
        .collection('rooms')
        .doc(currentRoomId)
        .collection('drawings')
        .doc(currentRoundDrawingId)
        .update({
          canvasData: this.canvasData
        })
      // console.log(currentRoundIndex)
      // db.ref(`rooms/${currentRoom}/drawings/`)
      // console.log(currentRoundDrawingCanvasRef)
      this.setState({
        x: this.canvasData[this.canvasData.length - 1].x,
        y: this.canvasData[this.canvasData.length - 1].y
      })
    }
  }
  // tempCanvas() {
  //   let line = {
  //     color: '',
  //     size: 0,
  //     startX: 0,
  //     startY: 0,
  //     endX: 0,
  //     endY: 0
  //   }
  //   let canvasArray = this.props.canvasData
  //   canvasArray.forEach((obj, idx, arr) => {
  //     ;(line.color = obj.color),
  //       (line.size = obj.size),
  //       (line.startX = arr[idx - 1].x),
  //       (line.startY = arr[idx - 1].y),
  //       (line.endX = obj.x),
  //       (line.endY = obj.y)
  //   })
  //   return line
  // }
  handleMouseUp() {
    this.setState({
      record: false
    })
  }
  render() {
    console.log(this.state.x, this.state.y)
    let line = {
      color: '#000',
      size: 6,
      startX: 0,
      startY: 0,
      endX: 50,
      endY: 50
    }
    return (
      <div
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onClick={drawLine(line)}
      >
        <CanvasDraw
          canvasWidth={this.state.width}
          canvasHeight={this.state.height}
          brushColor={this.state.color}
          brushSize={this.state.size}
        />
      </div>
    )
  }
}
