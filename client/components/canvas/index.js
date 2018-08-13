'use strict'

/**
 * Creates a whiteboard on the page that the user can scribble on.
 *
 * Exports:
 *   - default draw(from, to, color, shouldBroadcast)
 *   - events: an EventEmitter that emits `draw` events.
 */
import React, {Component} from 'react'
import db from '../../../firestore.js'

export default class Canvas extends Component {
  constructor() {
    super()
    this.state = {
      strokeColor: 'black',
      lineWidth: 3,
      x: 0,
      y: 0,
      record: false,
      canvasData: []
    }
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
  }
  async componentDidMount() {
    this.drawCanvas()
    // const roomId = location.pathname.slice(1)
    const roomId = 'aQFOGkBUusXJmGP808XR' // REPLACE WITH LINE ABOVE

    // const drawingInstance = await db
    const drawingCollectionInfo = await db
      .collection(`rooms/${roomId}/drawings`)
      .get()
    console.log(drawingCollectionInfo)
    const drawingCollection = await db.collection(`rooms/${roomId}/drawings`)
    console.log('Here is drawing collectioninfo!:', drawingCollectionInfo)
    if (drawingCollectionInfo.empty) {
      console.log('drawing collection is empty! Time to add some stuff@!')
      drawingCollection.add({
        canvasData: [this.state]
      })
    } else {
      const drawingDoc = drawingCollectionInfo.docs[0].id
      await db.doc(`rooms/${roomId}/drawings/${drawingDoc}`).update({
        canvasData: this.canvasData
      })
    }
    // this.setState({
    //   canvasData
    // })
  }

  // componentDidUpdate() {
  //   this.drawCanvas()
  // }
  drawCanvas(start, end, strokeColor = 'black') {
    const ctx = this.theCanvas.getContext('2d')
    ctx.beginPath()
    ctx.strokeStyle = strokeColor
    ctx.moveTo(...start)
    ctx.lineTo(...end)
    ctx.closePath()
    ctx.stroke()
  }
  handleMouseDown(event) {
    this.setState({
      record: true
    })
  }
  handleMouseMove(event) {
    if (this.state.record) {
      console.log(this.state.canvasData)
      const latestPoint = {
        x: event.clientX,
        y: event.clientY,
        strokeColor: 'black',
        size: 3
      }

      if (this.state.canvasData.length > 1) {
        this.state.canvasData.forEach((point, idx, arr) => {
          if (idx > 0 && idx < arr.length) {
            let startX = arr[idx - 1].x
            let startY = arr[idx - 1].y
            let endX = point.x
            let endY = point.y
            this.drawCanvas(
              [startX, startY],
              [endX, endY],
              arr[idx].strokeColor
            )
          }
        })
      }
      this.setState({
        canvasData: [...this.state.canvasData, latestPoint]
      })
    }
  }
  handleMouseUp() {
    this.setState({
      record: false
    })
  }
  render() {
    return (
      <div
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
      >
        <canvas
          ref={canvas => (this.theCanvas = canvas)}
          height={500}
          width={500}
        />
      </div>
    )
  }
}
