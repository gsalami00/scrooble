import React, {Component, Fragment} from 'react'
import Input from './Input'

export default class Messages extends Component {
  constructor() {
    super()
    this.state = {
      messages: ['c00l_username: hello chatroom!!', 'otherUzer: um hi']
    }
  }
  addMessage(message) {
    event.preventDefault()
    const userName = 'username'
    const userAndMessage = `${userName}: ${message}`
    this.setState({
      messages: [...this.state, {messages: userAndMessage}]
    })
  }
  render() {
    // make username and colon bold
    // font should be arial or sans-serif and small ... how about, do that in css and give calssname here
    return (
      <div className="chat">
        {this.state.messages.map(userAndMessage => {
          return (
            <div>
              {userAndMessage}
              {'\n'}
            </div>
          )
        })}
        <Input addMessage={this.addMessage} />
      </div>
    )
  }
}
