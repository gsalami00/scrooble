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
          .where('gini', '==', true)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(room => {
              notFullRooms.push(room.id)
            })
          })
          .catch(err => {
            console.log('Error getting documents: ', err)
          })
        await localStorage.setItem('room', notFullRooms[0])
        this.props.history.push('/username-decider')
      } else {
        const room = await db.collection('rooms').add({
          isFull: false,
          round: 0,
          waitingRoom: 0,
          turnOrder: [],
          chosenWord: ''
        })
        await localStorage.setItem('room', room.id)
        this.props.history.push('/username-decider')
      }
    } catch (err) {
      console.log(err)
    }
  }
  render() {
    return (
      <React.Fragment>
        <div className="loading-text">Loading room...</div>
        <br />
        <div className="cssload-loader">
          <div className="cssload-inner cssload-one" />
          <div className="cssload-inner cssload-two" />
          <div className="cssload-inner cssload-three" />
        </div>
      </React.Fragment>
    )
  }
}
