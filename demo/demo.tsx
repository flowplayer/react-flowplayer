import ReactDom from "react-dom"
import React, { useEffect, useRef, useState } from "react"
import Flowplayer, { useFlowplayer } from "../src"

const DEMO_TOKEN = "eyJraWQiOiJiRmFRNEdUam9lNVEiLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjIjoie1wiYWNsXCI6NixcImlkXCI6XCJiRmFRNEdUam9lNVFcIixcImRvbWFpblwiOltcImJ1aWxkcy5mbG93cGxheWVyLmNvbVwiXX0iLCJpc3MiOiJGbG93cGxheWVyIn0.upfvSSPnB-v2ADHfbWG8ye9jDQhgwnMhZWQUqDS2DOLQbldCt9N8Atbq-gRm4GbqRRS7zoBFvvf6CgYWaV93nw"

const flowplayer = window.flowplayer // TODO: fix
  
const Main = () => {
    const playerRef = useRef(null)

    // Get API handle in an asynchronous manner
    const playerApi = useFlowplayer(playerRef)

    const [demoPlaybackState, setDemoPlaybackState] = useState("paused")

    const togglePlay = () => {
        if (!playerApi) return // No API available
        playerApi.togglePlay()
    }


    // Listen to player events for the demo
    useEffect(() => {
        if (!playerApi) return
        function stateHandler(ev: Event) {
            if (ev.type === flowplayer.events.PAUSE)
                setDemoPlaybackState("paused")
            if (ev.type === flowplayer.events.PLAYING)
                setDemoPlaybackState("playing")
        }

        playerApi.on([flowplayer.events.PAUSE, flowplayer.events.PLAYING], stateHandler)

        return () => { // Cleanup on unmount
            playerApi.off(flowplayer.events.PAUSE, stateHandler)
            playerApi.off(flowplayer.events.PLAYING, stateHandler)
        }
    })


    return (
        <div className="container">
            <h1>Flowplayer React Demo</h1>
            <div className="row">
                <div className="column">
                    <Flowplayer ref={playerRef} src="//edge.flowplayer.org/bauhaus.mp4" token={DEMO_TOKEN} />
                </div>
            </div>
            <div className="row">
                <div className="column">
                    Playback state is: { demoPlaybackState }
                </div>
            </div>
            <div className="row">
                <div className="column">
                    <h2>API handles</h2>
                    <button onClick={togglePlay}>Play / pause</button>
                </div>
            </div>
        </div>
    )
}

const container = document.querySelector("#main")

ReactDom.render(<Main />, container)