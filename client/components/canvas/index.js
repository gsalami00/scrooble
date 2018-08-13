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
      color: '#000000',
      lineWidth: 6,
      x: 0,
      y: 0
    }
    this.canvasData = []
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

  componentDidUpdate() {
    this.drawCanvas()
  }

  drawCanvas() {
    const context = this.theCanvas.getContext('2d')
  }

  render() {
    return (
      <div>
        <canvas
          ref={canvas => (this.theCanvas = canvas)}
          height={500}
          width={500}
        />
      </div>
    )
  }
}
