import React, {Component} from 'react'
import db from '../../../firestore.js'

export default class UsernameDecider extends Component {
  constructor(props) {
    super(props)
    this.usernameCheck = this.usernameCheck.bind(this)
  }
  async componentDidMount() {
    try {
      const gameRoomId = localStorage.getItem('room')
      let username = localStorage.getItem('username')
      const finalUsername = await this.usernameCheck(username)
      localStorage.setItem('username', finalUsername)
      // creates player:
      await db.doc(`rooms/${gameRoomId}/players/${finalUsername}`).set({
        score: 0,
        myTurn: false,
        guessedWord: false,
        username: finalUsername
      })
      //this.props.history.push(`/${gameRoomId}`)
    } catch (err) {
      console.log(err)
    }
  }
  async usernameCheck(username) {
    try {
      const gameRoomId = localStorage.getItem('room')
      const response = await db
        .collection('rooms')
        .doc(gameRoomId)
        .collection('players')
        .get()
      console.log('response is', response)
      const players = await response.docs
      console.log('players is', players)
      const data = await response.data()
      console.log('data is', data)
      //

      // let docRef = await db.doc(`rooms/${gameRoomId}/players/${username}`)
      // await docRef.get().then(doc => {
      //   if (doc.exists) {
      //     username = `${username}${Math.floor(Math.random() * 100000)}`
      //     return this.usernameCheck(username)
      //   } else {
      //     return username
      //   }
      // })
      // return username
    } catch (err) {
      console.log(err)
    }
  }
  render() {
    return <div>Confirming unique username...</div>
  }
}
