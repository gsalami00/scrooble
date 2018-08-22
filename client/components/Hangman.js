import React, {Component} from 'react'

export default class Hangman extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    let {chosenWord, time, myTurn} = this.props
    if (!myTurn) {
      if (time > 0) {
        chosenWord = '_ '.repeat(chosenWord.length).slice(0, -1)
      } else {
        chosenWord = chosenWord.split('').join(' ')
      }
    }
    return (
      <React.Fragment>
        <div className="hangman">{chosenWord}</div>
      </React.Fragment>
    )
  }
}
