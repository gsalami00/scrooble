import React, {Component} from 'react'

export default class Messages extends Component {
  constructor() {
    super()
    this.state = {
      message: '',
      messages: [
        [1, 'c00l_username: hello chatroom!!'], // these cannot be objects like {key: 3, message: 'hi'}, in order to render below
        [2, 'otherUzer: um hi']
      ]
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  handleSubmit(event) {
    event.preventDefault()
    const userName = 'mango_fan'
    const userAndMessage = `${userName}: ${this.state.message}`
    const nextKey = this.state.messages[this.state.messages.length - 1][0] + 1
    this.setState({
      messages: [...this.state.messages, [nextKey, userAndMessage]],
      message: ''
    })
  }
  render() {
    // CSS to do:
    // - make username and colon bold
    // - font should be arial or sans-serif and small
    return (
      <div className="chat">
        {this.state.messages.map(userAndMessage => {
          return (
            <div key={userAndMessage[0]}>
              {userAndMessage[1]}
              {'\n'}
            </div>
          )
        })}
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="message"
            value={this.state.message}
            onChange={this.handleChange}
            placeholder="Make guesses here!"
          />
          <button type="Submit">GO</button>
        </form>
      </div>
    )
  }
}
