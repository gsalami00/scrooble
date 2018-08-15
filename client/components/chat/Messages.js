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
        // [1, 'Welcome to the chat!']
      ],
      roomNumber: '1',
      chatNumber: '1',
      guessedWord: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  async componentDidMount() {
    try {
      let allMessages = []
      console.log('allMessages is', allMessages)
      let idx = this.state.messages.length
      this.listener = await db
        .collection('rooms')
        .doc(this.props.roomId)
        .collection('chats')
        .onSnapshot(async querySnapshot => {
          querySnapshot.forEach(col => {
            idx++
            console.log('allMessages so far is', allMessages)
            allMessages.push([
              idx,
              col.data().username + ': ' + col.data().message
            ])
          })
          if (allMessages.length) {
            console.log('this.state.messages before', this.state.messages)
            await this.setState({
              messages: allMessages
            })
            console.log('this.state.messages after', this.state.messages)
          }
          allMessages = []
        })
    } catch (err) {
      console.log(err)
    }
  }
  componentWillUnmount() {
    this.listener.unsubscribe()
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  async handleSubmit(event) {
    try {
      event.preventDefault()
      if (!this.state.guessedWord) {
        const username = localStorage.getItem('username')
        const roomId = localStorage.getItem('room')
        const response = await db
          .collection('rooms')
          .doc(roomId)
          .get()
        const chosenWord = await response.data().chosenWord
        let {message, messages} = this.state // let instead of const because we check message.toLowerCase()
        if (message && chosenWord === message.toLowerCase()) {
          // IF CORRECT WORD (making sure not empty string, then making sure same as chosenWord)
          await db
            .collection('rooms')
            .doc(this.props.roomId)
            .collection('chats')
            .add({
              message: `${username} guessed the word!`
            })
          const nextKey = messages[messages.length - 1][0] + 1
          this.setState({
            messages: [...messages, [nextKey, `${username} guessed the word!`]],
            message: '',
            guessedWord: true
          })
          // end of turn, loop through each player and make guessed equal to false
        } else {
          const userAndMessage = `${username}: ${message}`
          const nextKey = messages[messages.length - 1][0] + 1
          await db
            .collection('rooms')
            .doc(this.props.roomId)
            .collection('chats')
            .add({
              username: localStorage.getItem('username'),
              message: this.state.message
            })
          this.setState({
            messages: [...messages, [nextKey, userAndMessage]],
            message: ''
          })
        }
      } else {
        const {messages} = this.state
        const username = localStorage.getItem('username')
        const nextKey = messages[messages.length - 1][0] + 1
        this.setState({
          messages: [
            ...messages,
            [nextKey, `You already guessed the word! :D`]
          ],
          message: ''
        })
        await db
          .collection('rooms')
          .doc(this.props.roomId)
          .collection('chats')
          .add({
            username,
            message: this.state.message
          })
      }
      this.scroll.current.scrollTop = this.scroll.current.scrollHeight
    } catch (err) {
      console.log(err)
    }
  }
  render() {
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
            className="input"
          />
          <button type="Submit">GO</button>
        </form>
      </div>
    )
  }
}
