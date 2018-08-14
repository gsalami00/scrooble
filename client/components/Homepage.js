import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import db from '../../firestore.js'
import {forEach} from '@firebase/util'

export default class Homepage extends Component {
  constructor() {
    super()
    this.state = {
      username: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    // const snapshot = db.collection('rooms').doc('5J2RcS6VBh9zZSxRnLhW').collection('players')
    // snapshot.get().then(result => {
    //   result.forEach(player=> {
    //     console.log(player.data())
    //   })
    // })
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  handleSubmit(event) {
    event.preventDefault()

    // this.props.history.push({
    //   pathname: '/gameroomfinder',
    //   state: this.state.username
    // })
    localStorage.setItem('username', this.state.username)
    this.props.history.push('/gameroomfinder')
  }
  render() {
    return (
      <div className="play-card" >
        <div className="quick-play" >Quick Play</div>

        {/* <Link to="/gameroom">GAMEROOM</Link> */}

        <form className="homepage-form" onSubmit={this.handleSubmit}>
          <label htmlFor="username">Player Name</label>
          <br />
          <input
            name="username"
            type="text"
            // placeholder="Enter Name"
            value={this.state.username}
            onChange={this.handleChange}
            className="form-input"
          />
          <br />
          <button className="btn" type="submit">Play Now</button>
        </form>
      </div>
    )
  }
}
