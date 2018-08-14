import React, {Component} from 'react'
import db from '../../../firestore'

// this component grabs all the words and puts them in another array in the room, that way we can 'eliminate' each word as they are chosen by illustrators.
// it's triggered when a new room is open
// ideally it would be a screen after choosing name. so, "loading room... grabbing words... confirming unique username... "

export default class GrabWords extends Component {
  constructor() {
    super()
    this.state = {
      roomId: localStorage.getItem('room')
    }
  }
  async componentDidMount() {
    try {
      // first, check if room is empty! only need to grab words if new room.
      // (MAYBE a previous loading-component should figure out whether to come here or not; i.e., IT would figure out whether room is empty and thus whether to come here or not)
      const roomIsEmpty = async () => {
        const playerCollection = await db
          .collection(`rooms/${this.state.roomId}/players/`)
          .get()
        let numPlayers = 0
        playerCollection.forEach(player => {
          numPlayers++
          if (numPlayers > 1) {
            // greater than 1 or 0? depends if this user is in room yet
            return false
          }
        })
        return true
      }
      if (roomIsEmpty()) {
        const wordsCollection = await db.collection('words').get()
        const wordsArray = []
        wordsCollection.forEach(word => wordsArray.push(word.id))
        await db
          .collection('rooms')
          .doc(this.state.roomId)
          .update({
            words: wordsArray
          })
        this.props.history.push(`/${localStorage.getItem('room')}`)
      } else {
        this.props.history.push('/') // wherever they go next. depends where in stack of loading components this goes.
      }
    } catch (err) {
      console.log(err)
    }
  }
  render() {
    return <div>Grabbing words...</div>
  }
}
