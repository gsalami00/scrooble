// import Input from './Input'
import Messages from './Messages'
// import Top from './Top'

import React from 'react'

// export default {Top, Messages, Input}

const Chat = props => {
  return (
    <React.Fragment>
      {/* <Top /> */}
      <Messages roomId={props.roomId} />
      {/* <Input /> */}
    </React.Fragment>
  )
}

export default Chat
