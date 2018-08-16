import React, {Component} from 'react'
import db from '../../../firestore.js'

export default class Messages extends Component {
  constructor(props) {
    super(props)
    this.roomId = location.pathname.slice(1)
    this.scroll = React.createRef()
    this.state = {
      message: '',
      messages: [[0]],
      guessedWord: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  async componentDidMount() {
    try {
      let allMessages = []
      let idx = this.state.messages.length
      this.listener = await db
        .collection('rooms')
        .doc(this.props.roomId)
        .collection('chats')
        .onSnapshot(async querySnapshot => {
          querySnapshot.forEach(col => {
            idx++
            allMessages.push([
              idx,
              col.data().username + ': ' + col.data().message
            ])
          })
          if (allMessages.length) {
            await this.setState({
              messages: allMessages
            })
          }
          allMessages = []
        })
    } catch (err) {
      console.log(err)
    }
  }
  async componentWillUnmount() {
    await this.listener.unsubscribe()
    await db
      .collection('rooms')
      .doc(localStorage.getItem('room'))
      .collection('players')
      .doc(localStorage.getItem('username'))
      .delete()
    console.log(
      'user is',
      await db
        .collection('rooms')
        .doc(localStorage.getItem('room'))
        .collection('players')
        .doc(localStorage.getItem('username'))
    )
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
        const roomId = this.roomId
        const responseChosenWord = await db
          .collection('rooms')
          .doc(roomId)
          .get()
        const chosenWord = await responseChosenWord.data().chosenWord
        let {message, messages} = this.state // let instead of const because we check message.toLowerCase()
        if (message && chosenWord === message.toLowerCase()) {
          // IF CORRECT WORD (making sure not empty string, then making sure same as chosenWord)
          const responsePlayer = await db
            .collection('rooms')
            .doc(roomId)
            .collection('players')
            .doc(username)
            .get()
          const score = await responsePlayer.data().score
          const room = await db
            .collection('rooms')
            .doc(roomId)
            .get()
          const timeLeft = await room.data().timer
          await db
            .collection('rooms')
            .doc(roomId)
            .collection('players')
            .doc(username)
            .update({
              guessedWord: true,
              score: score + timeLeft * 10
            })
          const nextKey = messages[messages.length - 1][0] + 1
          this.setState({
            messages: [...messages, [nextKey, `${username} guessed the word!`]],
            message: '',
            guessedWord: true
          })
          const documentNumber = (messages.length + 1).toString()
          await db
            .collection('rooms')
            .doc(roomId)
            .collection('chats')
            .doc(documentNumber)
            .set({
              username: localStorage.getItem('username'),
              message: `${localStorage.getItem('username')} guessed the word!`
            })
          this.setState({
            messages: [...messages, [nextKey, userAndMessage]],
            message: ''
          })
          // end of turn, loop through each player and make guessed equal to false
        } else {
          const userAndMessage = `${username}: ${message}`
          const nextKey = messages[messages.length - 1][0] + 1
          const documentNumber = messages.length + 1
          await db
            .collection('rooms')
            .doc(roomId)
            .collection('chats')
            .doc(documentNumber)
            .set({
              username: localStorage.getItem('username'),
              message: this.state.message
            })
          this.setState({
            messages: [...messages, [nextKey, userAndMessage]],
            message: ''
          })
        }
      } else {
        const {message, messages} = this.state
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
          .doc((messages.length + 1).toString())
          .add({
            username,
            message
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
