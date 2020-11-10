import ReactDom from "react-dom"
import React, { useEffect, useMemo, useRef, useState } from "react"
import Flowplayer, { useFlowplayer } from "../src"

const flowplayer = window.flowplayer // TODO: fix
  
const Main = () => {
    const playerRef = useRef(null)

    const playerApi = useFlowplayer(playerRef)

    const [demoPlaybackState, setDemoPlaybackState] = useState("paused")

    const togglePlay = () => {
        if (!playerApi) return // No API available
        playerApi.togglePlay()
    }

    useEffect(() => {
        if (!playerApi) return
        function stateHandler(ev: Event) {
            if (ev.type === flowplayer.events.PAUSE)
                setDemoPlaybackState("paused")
            if (ev.type === flowplayer.events.PLAYING)
                setDemoPlaybackState("playing")
        }
        playerApi.on([flowplayer.events.PAUSE, flowplayer.events.PLAYING], stateHandler)
        return () => {
            playerApi.off(flowplayer.events.PAUSE, stateHandler)
            playerApi.off(flowplayer.events.PLAYING, stateHandler)
        }
    })


    return (
        <div className="container">
            <h1>Flowplayer React Demo</h1>
            <div className="row">
                <div className="column">
                    <Flowplayer ref={playerRef} src="//edge.flowplayer.org/bauhaus.mp4" />
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