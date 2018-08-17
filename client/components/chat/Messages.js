import React, {Component} from 'react'
import db from '../../../firestore.js'

export default class Messages extends Component {
  constructor(props) {
    super(props)
    this.roomId = location.pathname.slice(1)
    this.scroll = React.createRef()
    this.state = {
      message: '',
      messages: [[0, '']],
      guessedWord: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  async componentDidMount() {
    try {
      let allMessages = []
      let idx = this.state.messages.length
      const {messages} = this.state
      this.listener = await db
        .collection('rooms')
        .doc(this.roomId)
        .collection('chats')
        .onSnapshot(async querySnapshot => {
          querySnapshot.forEach(col => {
            idx++
            allMessages.push([
              idx,
              col.data().username + ': ' + col.data().message
            ])
          })
          const nextKey = messages[messages.length - 1][0] + 1
          if (allMessages.length) {
            const combine = [nextKey, allMessages]
            await this.setState({
              messages: [...messages, combine]
            })
            console.log('this.state.messages is', this.state.messages)
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
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  async handleSubmit(event) {
    try {
      event.preventDefault()
      const username = localStorage.getItem('username')
      const roomId = this.roomId
      let {message, messages} = this.state
      if (!this.state.guessedWord) {
        const room = await db
          .collection('rooms')
          .doc(roomId)
          .get()
        const chosenWord = await room.data().chosenWord
        if (message && chosenWord === message.toLowerCase()) {
          // IF CORRECT WORD (making sure not empty string, then making sure same as chosenWord)
          const responsePlayer = await db
            .collection('rooms')
            .doc(roomId)
            .collection('players')
            .doc(username)
            .get()
          const score = await responsePlayer.data().score
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
          const documentNumberResponse = await db
            .collection('rooms')
            .doc(this.roomId)
            .get()
          const documentNumber = documentNumberResponse.data().messageCount
          await db
            .collection('rooms')
            .doc(this.roomId)
            .doc((documentNumber + 1).toString())
            .set({
              username,
              message
            })
          await db
            .collection('rooms')
            .doc(this.roomId)
            .update({
              messageCount: documentNumber + 1
            })
          this.setState({
            messages: [...messages, [nextKey, `${username} guessed the word!`]],
            message: ''
          })
          // end of turn, loop through each player and make guessed equal to false
        } else {
          const userAndMessage = `${username}: ${message}`
          const nextKey = messages[messages.length - 1][0] + 1
          const documentNumberResponse = await db
            .collection('rooms')
            .doc(this.roomId)
            .get()
          const documentNumber = documentNumberResponse.data().messageCount
          await db
            .collection('rooms')
            .doc(this.roomId)
            .collection('chats')
            .doc((documentNumber + 1).toString())
            .set({
              username,
              message
            })
          await db
            .collection('rooms')
            .doc(this.roomId)
            .update({
              messageCount: documentNumber + 1
            })
          this.setState({
            messages: [...messages, [nextKey, userAndMessage]],
            message: ''
          })
        }
      } else {
        // if they have already guessed and trying to type more during this 'turn'
        const nextKey = messages[messages.length - 1][0] + 1
        this.setState({
          messages: [
            ...messages,
            [nextKey, `You already guessed the word! 😄`]
          ],
          message: ''
        })
        const documentNumberResponse = await db
          .collection('rooms')
          .doc(this.roomId)
          .collection('chats')
          .get()
        const documentNumber = documentNumberResponse.data().messageCount
        await db
          .collection('rooms')
          .doc(this.roomId)
          .collection('chats')
          .doc((documentNumber + 1).toString())
          .set({
            username,
            message
          })
        await db
          .collection('rooms')
          .doc(this.roomId)
          .update({
            messageCount: documentNumber + 1
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
            console.log('userAndMessage is', userAndMessage)
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
