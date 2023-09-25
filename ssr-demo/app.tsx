import * as React from "react"
import Flowplayer from "../src/flowplayer"

const App = () => {
  return (
    <div>
      <Flowplayer src="https://edge.flowplayer.org/bauhaus.mp4" token="my-token" />
    </div>
  )
}

export default App