import React, {Component} from 'react'
import db from '../../../firestore.js'

export default class GameroomFinder extends Component {
  async componentDidMount() {
    try {
      const rooms = await db.collection('rooms').get()
      if (rooms.size) {
        let notFullRooms = []
        await db
          .collection('rooms')
          .where('isFull', '==', true) // change true to false after testing
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(room => {
              notFullRooms.push(room.id)
            })
          })
          .catch(err => {
            console.log('Error getting documents: ', err)
          })
        localStorage.setItem('room', notFullRooms[0])
        this.props.history.push('/username-decider')
      } else {
        const room = await db.collection('rooms').add({
          isFull: false,
          playerCount: 1,
          isPrivate: false,
          round: 1,
          timer: 30
        })
        const drawingInstance = await db
          .collection('rooms')
          .doc(room.id)
          .collection('drawings')
          .add({
            canvasData: []
          })
        localStorage.setItem('room', room.id)
        this.props.history.push('/username-decider')
      }
    } catch (err) {
      console.log(err)
    }
  }
  render() {
    return <div>Loading room...</div>
  }
}
