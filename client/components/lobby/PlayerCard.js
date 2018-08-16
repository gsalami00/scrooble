import React, {Component} from 'react'

export default class PlayerCard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <React.Fragment>
        <div>{this.props.name}</div>
        <div>points: 100</div>
      </React.Fragment>
    )
  }
}
