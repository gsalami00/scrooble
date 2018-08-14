import React, {Component, Fragment} from 'react'
import db from '../../../firestore.js'

export default class ChooseWordPrompt extends Component {
  constructor() {
    super()
    this.state = {
      threeWords: [],
      time: 12,
      roomId: localStorage.getItem('room')
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  async componentDidMount() {
    this.countdown()
    const response = await db
      .collection('words')
      .doc('words')
      .get()
    const words = await response.data()
    const wordsArray = Object.values(words)
    const assureUnequalWords = () => {
      const firstWord =
        wordsArray[0][Math.floor(Math.random() * wordsArray[0].length)]
      const secondWord =
        wordsArray[0][Math.floor(Math.random() * wordsArray[0].length)]
      const thirdWord =
        wordsArray[0][Math.floor(Math.random() * wordsArray[0].length)]
      if (
        firstWord !== secondWord &&
        secondWord !== thirdWord &&
        thirdWord !== firstWord
      ) {
        this.setState({
          threeWords: [[1, firstWord], [2, secondWord], [3, thirdWord]]
        })
        // then, eliminate these three words from possible words for this game (i.e. for this room)! --> what if out of words? then all words come back.
        // all the words should be pushed to the room in some way, and then eliminated as users go through. keep in mind there are only 345 words.
      } else {
        assureUnequalWords()
      }
    }
    assureUnequalWords()
  }
  async handleSubmit(word) {
    event.preventDefault()
    await db
      .collection('rooms')
      .doc('HYHaIxc24e9R9jzNcJA9') // temporarily will have hard-coded room since component is currently outside of game while in development
      .update({
        chosenWord: word
      })
    const response = await db // this double-checks by grabbing the chosenWord from db instead of just what was clicked
      .collection('rooms')
      .doc('HYHaIxc24e9R9jzNcJA9') // temporarily will have hard-coded room since component is currently outside of game while in development
      .get()
    const chosenWord = response.data().chosenWord
    alert(`The word has been updated to ${chosenWord}`)
    // then, tell (set) database that this word is chosenWord
  }
  countdown() {
    let currTime = this.state.time
    const timer = setInterval(() => {
      // const timer necessary in order to stop it later with clearInterval
      if (currTime > -1) {
        this.setState({
          time: currTime--
        })
      } else {
        alert("Thaaat's the timer! Come play again :)")
        localStorage.setItem('username', null)
        localStorage.setItem('room', null)
        // delete player from room -- grab current players, then update without player from localStorage.getItem('user')
        this.props.history.push('/')
        clearInterval(timer)
      }
    }, 1000)
  }
  render() {
    return (
      <Fragment>
        <div>
          Choose one of these words to draw!
          {this.state.threeWords.map(word => {
            return (
              <button
                key={word[0]}
                type="submit"
                onClick={() => this.handleSubmit(word[1])}
              >
                {word[1]}
              </button>
            )
          })}
        </div>
        <div>{this.state.time}</div>
      </Fragment>
    )
  }
}
