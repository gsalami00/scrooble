import React, {Component} from 'react'
import db from '../../firestore.js'
import {forEach} from '@firebase/util'
import Chat from './chat'
import Lobby from './lobby'
import Canvas from './canvas'
import {Link} from 'react-router-dom'

export default class Gameroom extends Component {
  constructor() {
    super()
    this.state = {
      username: localStorage.getItem('username'),
      canvasData: []
    }
    this.handleUpdate = this.handleUpdate.bind(this)
  }
  async componentDidMount() {
    const canvasInstance = await db
      .collection('rooms')
      .doc(location.pathname.slice(1))
      .collection('drawings')
      .doc('5TBBhPQ69Oa3HmfkwCIa')
    // canvasInstance.onSnapshot(snapshot => {
    //   let dataArray = snapshot.data().canvasData
    //   this.setState({
    //     canvasData: [dataArray[dataArray.length - 1]]
    //   })
    // })
  }
  handleUpdate() {
    this.setState({
      canvasData: [1, 2, 3]
    })
  }
  render() {
    console.log(this.state.canvasData)
    return (
      <div>
        <Link to="/">Home</Link>
        <div className="lobbybox">
          <Lobby roomId={this.props.match.params.gameroom} />
        </div>
        <div className="canvas">
          <Canvas canvasData={this.state.canvasData} />
        </div>
        <div className="chatbox">
          <Chat roomId={this.props.match.params.gameroom} />
        </div>
      </div>
    )
  }
}
