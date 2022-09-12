import "@flowplayer/player/flowplayer.css";

import ReactDom from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import flowplayer from "@flowplayer/player";
import Flowplayer, { useFlowplayer } from "../src";
import PreviewPlugin from "@flowplayer/player/plugins/preview";

import { PAUSE, PLAYING } from "@flowplayer/player/core/events";
import { SOURCES, DEMO_TOKEN, ANIMATED_PREVIEW } from "./config";

// - Load plugins
flowplayer(PreviewPlugin);

// - Component
const Main = () => {
  // Get API handle in an asynchronous manner
  const playerRef = useRef<HTMLDivElement | null>(null);
  const playerApi = useFlowplayer(playerRef);

  const [demoPlaybackState, setDemoPlaybackState] = useState("paused");
  const [demoSrc, setDemoSrc] = useState(SOURCES[0]);

  const togglePlay = () => {
    if (!playerApi) return; // No API available
    playerApi.togglePlay();
  };

  const toggleSrc = () => {
    const nextIndex = SOURCES.indexOf(demoSrc) + 1;
    setDemoSrc(SOURCES[nextIndex] || SOURCES[0]);
  };

  function stateHandler(ev: Event) {
    if (ev.type === PAUSE) setDemoPlaybackState("paused");
    if (ev.type === PLAYING) setDemoPlaybackState("playing");
  }

  // Listen to player events for the demo
  useEffect(() => {
    if (!playerApi) return;
    playerApi.on([PAUSE, PLAYING], stateHandler);

    return () => {
      // Cleanup on unmount
      if (!playerApi) return;
      playerApi.off(PAUSE, stateHandler);
      playerApi.off(PLAYING, stateHandler);
    };
  }, [playerApi]);

  return (
    <div className="container">
      <h1>Flowplayer React Demo</h1>
      <div className="row">
        <div className="column">
          <Flowplayer
            src={demoSrc}
            token={DEMO_TOKEN}
            ref={playerRef}
            opts={{
              title: "Example title",
              description: "Example description",
              poster: { },
              preview: { src: ANIMATED_PREVIEW }
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
};

const container = document.querySelector("#main");

ReactDom.render(<Main />, container);
