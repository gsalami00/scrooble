import React, {Component, Fragment} from 'react'

export default class Input extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange() {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  handleSubmit() {
    // may not need anything in parameter, just send what's in state
    event.preventDefault()
    // receive props from general messages part, which modifies the messages part, and adds a message to there. (So this may have to be inside of Input in order to receive props, unless an even-more-outer thing is making that function and passing it down)
  }
  render() {
    return (
      <form onSubmit={() => this.props.addMessage(this.state.text)}>
        <input
          type="text"
          name="text"
          value={this.state.text}
          onChange={this.handleChange}
          placeholder="Make guesses here!"
        />
        <button type="Submit">GO</button>
      </form>
    )
  }
}
