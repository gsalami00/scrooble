import React, {Component} from 'react'

export default class Winner extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const {winner} = this.props
    return (
      <div className="winner-card">
        <div className="winner-text" >{/*winner.toUpperCase()*/} IS THE WINNER</div>
      </div>
    )
  }
}
