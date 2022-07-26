import ReactDom from "react-dom"
import React, { useEffect, useRef, useState } from "react"
import { useFlowplayer } from "../src"
import { PAUSE, PLAYING } from "@flowplayer/player/core/events"

import "@flowplayer/player/flowplayer.css"

const DEMO_TOKEN = "eyJraWQiOiJiRmFRNEdUam9lNVEiLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjIjoie1wiYWNsXCI6NixcImlkXCI6XCJiRmFRNEdUam9lNVFcIixcImRvbWFpblwiOltcImJ1aWxkcy5mbG93cGxheWVyLmNvbVwiXX0iLCJpc3MiOiJGbG93cGxheWVyIn0.upfvSSPnB-v2ADHfbWG8ye9jDQhgwnMhZWQUqDS2DOLQbldCt9N8Atbq-gRm4GbqRRS7zoBFvvf6CgYWaV93nw"


const SOURCES = ["//edge.flowplayer.org/bauhaus.mp4", "//edge.flowplayer.org/functional.mp4"]

const Main = () => {

    // Get API handle in an asynchronous manner
    const { api: playerApi, Flowplayer } = useFlowplayer({ token: DEMO_TOKEN })

    const [demoPlaybackState, setDemoPlaybackState] = useState("paused")

    const [demoSrc, setDemoSrc] = useState(SOURCES[0])

    const togglePlay = () => {
        if (!playerApi) return // No API available
        playerApi.togglePlay()
    }

    const toggleSrc = () => {
        const nextIndex = SOURCES.indexOf(demoSrc) + 1
        setDemoSrc(SOURCES[nextIndex] || SOURCES[0])
    }


    // Listen to player events for the demo
    useEffect(() => {
        if (!playerApi) return
        function stateHandler(ev: Event) {
            if (ev.type === PAUSE)
                setDemoPlaybackState("paused")
            if (ev.type === PLAYING)
                setDemoPlaybackState("playing")
        }

        playerApi.on([PAUSE, PLAYING], stateHandler)

        return () => { // Cleanup on unmount
            if (!playerApi) return
            playerApi.off(PAUSE, stateHandler)
            playerApi.off(PLAYING, stateHandler)
        }
    }, [playerApi])

    return (
      <div className="container">
        <h1>Flowplayer React Demo</h1>
        <div className="row">
          <div className="column">
            <Flowplayer
              src={demoSrc}
              token={DEMO_TOKEN}
              uiConfig={{
                usePlay2: false,
                noFullscreen: false,
                usePlay3: true,
                noMute: true
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="column">Playback state is: {demoPlaybackState}</div>
        </div>
        <div className="row">
          <div className="column">
            <h2>API handles</h2>
            <button onClick={togglePlay}>Play / pause</button>
          </div>
          <div className="column">
            <h2>Configuration changes</h2>
            <button onClick={toggleSrc}>Toggle source</button>
          </div>
        </div>
      </div>
    );
}

const container = document.querySelector("#main")

ReactDom.render(<Main />, container)