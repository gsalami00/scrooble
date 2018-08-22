import React, {Component} from 'react'

export default class PlayerCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    const {idx, name, points, message, showBubble} = this.props
    return (
      <React.Fragment>
        <div className="single-player-container" key={idx}>
          <div className="playercard">
            <div>{name}</div>
            <div>points: {points}</div>
          </div>
          {
            showBubble ? <div className="message">{message}</div> : ''
          }
        </div>
      </React.Fragment>
    )
  }
}
