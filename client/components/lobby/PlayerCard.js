import React, {Component} from 'react'

export default class PlayerCard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const {name, score} = this.props
    return (
      <React.Fragment>
        <div>{name}</div>
        <div>points: {score}</div>
      </React.Fragment>
    )
  }
}
