import React, {Component} from 'react'
import db from '../../../firestore.js'

export default class Messages extends Component {
  constructor(props) {
    super(props)
    this.scroll = React.createRef()
    this.state = {
      message: '',
      messages: [
        // these cannot be objects like {key: 3, userAndMessage: 'hi'}, because that gives rendering error
        [1, 'c00l_username: hello chatroom!!'],
        [2, 'otherUzer: um hi']
      ],
      roomNumber: '1',
      chatNumber: '1',
      username: '',
      chosenWord: '' // this should exist in Room instance
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    this.setState({
      username: this.props.username
    })
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  async handleSubmit(event) {
    event.preventDefault()
    let {username, message, messages, chosenWord} = this.state // let instead of const because we check message.toLowerCase()
    if (message && chosenWord === message.toLowerCase()) {
      // IF CORRECT WORD (making sure not empty string, then making sure same as chosenWord)
      await db
        .collection('rooms')
        .doc(this.props.roomId)
        .collection('chats')
        .add({
          message: `${username} guessed the word!`
        })
      // await db
      //   .collection('rooms')
      //   .doc(this.props.roomId)
      //   .collection('players')
      //   .
      // need ID of this user we are being right now so we're updating the correct one!
      // make guessed property true
      // if guessed property true, disable chat input for remainder of round
      // end of turn, loop through each player and make guessed equal to false
    } else {
      const userAndMessage = `${username}: ${message}`
      const nextKey = messages[messages.length - 1][0] + 1
      this.setState({
        messages: [...this.state.messages, [nextKey, userAndMessage]],
        message: ''
      })
      await db
        // assign player to room
        .collection('rooms')
        .doc(this.props.roomId)
        .collection('chats')
        .add({
          username: this.state.username,
          message: this.state.message
        })
    }
    this.scroll.current.scrollTop = this.scroll.current.scrollHeight
  }
  render() {
    // CSS to do:
    // - make username and colon bold
    // - font should be arial or sans-serif and small
    return (
      <div className="chat">
        <div className="chat-messages" ref={this.scroll}>
          {this.state.messages.map(userAndMessage => {
            return (
              <div key={userAndMessage[0]}>
                {userAndMessage[1]}
                {'\n'}
              </div>
            )
          })}
        </div>
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
