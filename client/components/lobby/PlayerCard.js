import React, { Component } from 'react';

export default class PlayerCard extends Component {
  constructor() {
    super();
    this.state = {
    }
  }
  componentDidMount(){
    // const snapshot = db.collection('rooms').doc('5J2RcS6VBh9zZSxRnLhW').collection('players')
    // snapshot.get().then(result => {
    //   result.forEach(player=> {
    //     console.log(player.data())
    //   })
    // })
  }
  render() {
    return (
      <React.Fragment>
        <div>#1</div>
        <div>username</div>
        <div>points: 100</div>
        </React.Fragment>
    )
  }
}

