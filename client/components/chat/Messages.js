import React, {Component, Fragment} from 'react'
import Input from './Input'

export default class Messages extends Component {
  constructor() {
    super()
    this.state = {
      messages: []
    }
  }
  addMessage(message) {
    const userName = 'username'
    const userAndMessage = `${userName}: ${message}`
    this.setState({
      messages: [...this.state.messages, userAndMessage]
    })
  }
  render() {
    return (
      <Fragment>
        {this.state.messages.join('\r\n')}
        <Input addMessage={this.addMessage} />
      </Fragment>
    )
  }
}
