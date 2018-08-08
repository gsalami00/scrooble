import React, { Component } from 'react';

export default class Homepage extends Component {
  constructor() {
    super();
    this.state = {
      username: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  handleSubmit(event) {
   event.preventDefault()
    // do the firebase stuff here and then redirect to the game room
    this.props.history.push('/game')
  }
  render() {
    return (
      <div>
        <h1>Scrooble</h1>
        <div>Quick Play</div>
        <form onSubmit={this.handleSubmit} >
          <label htmlFor='username' >Player Name</label>
          <input name="username" type='text' placeholder='Enter Name' value={this.state.username} onChange={this.handleChange} />
          <br />
          <button type='submit'>Play Now</button>
        </form>
      </div>
    )
  }
}

