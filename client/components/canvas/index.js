'use strict'

/**
 * Creates a whiteboard on the page that the user can scribble on.
 *
 * Exports:
 *   - default draw(from, to, color, shouldBroadcast)
 *   - events: an EventEmitter that emits `draw` events.
 */
import React, {Component} from 'react'
import CanvasDraw from 'react-canvas-draw'

export default class Canvas extends Component {
  constructor() {
    super()
    this.state = {
      color: '#000',
      width: 800,
      height: 600,
      size: 6,
      x: 0,
      y: 0
    }
    this.handleMouseMove = this.handleMouseMove.bind(this)
  }
  componentDidMount() {
    // static defaultProps =
    //   loadTimeOffset: 5,
    //   brushSize: 6,
    //   brushColor: '#444',
    //   canvasWidth: 1000,
    //   canvasHeight: 1000,
    //   disabled: false
  }
  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    })
  }
  render() {
    // const line = {
    //   color: this.props.brushColor,
    //   size: this.props.brushSize,
    //   startX: this.x,
    //   startY: this.y,
    //   endX: newX,
    //   endY: newY
    // }
    console.log(this.state.x, this.state.y)
    return (
      <div
        style={{border: '1px solid black', width: '800px', margin: '0px auto'}}
        onMouseMove={this.handleMouseMove}
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
