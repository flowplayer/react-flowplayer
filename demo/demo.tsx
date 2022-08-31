import "@flowplayer/player/flowplayer.css";

import ReactDom from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import Flowplayer, { useFlowplayer } from "../src";
import { PAUSE, PLAYING } from "@flowplayer/player/core/events";
import flowplayer from "@flowplayer/player";
import Preview from "@flowplayer/player/plugins/preview";

const ANIMATED_PREVIEW = [
  {
    src: "http://l3video.lwcdn.com/preview/0edd6c9a-62f6-44a1-9382-36845a0003f4/ap-277c1297-4a63-4e8c-9b90-0d01e69042b5_360.webp",
    type: "image/webp",
    dimensions: {
      width: 640,
      height: 360,
    },
  },
  {
    src: "http://l3video.lwcdn.com/preview/0edd6c9a-62f6-44a1-9382-36845a0003f4/ap-277c1297-4a63-4e8c-9b90-0d01e69042b5_270.webp",
    type: "image/webp",
    dimensions: {
      width: 480,
      height: 270,
    },
  },
  {
    src: "http://l3video.lwcdn.com/preview/0edd6c9a-62f6-44a1-9382-36845a0003f4/ap-277c1297-4a63-4e8c-9b90-0d01e69042b5_720.webp",
    type: "image/webp",
    dimensions: {
      width: 1280,
      height: 720,
    },
  },
];

const DEMO_TOKEN =
  "eyJraWQiOiJiRmFRNEdUam9lNVEiLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjIjoie1wiYWNsXCI6NixcImlkXCI6XCJiRmFRNEdUam9lNVFcIixcImRvbWFpblwiOltcImJ1aWxkcy5mbG93cGxheWVyLmNvbVwiXX0iLCJpc3MiOiJGbG93cGxheWVyIn0.upfvSSPnB-v2ADHfbWG8ye9jDQhgwnMhZWQUqDS2DOLQbldCt9N8Atbq-gRm4GbqRRS7zoBFvvf6CgYWaV93nw";

const SOURCES = [
  "//edge.flowplayer.org/bauhaus.mp4",
  "//edge.flowplayer.org/functional.mp4"
];

flowplayer(Preview);

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
    playerApi.setOpts(
      {preview: { src: ANIMATED_PREVIEW }} as any
    )

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
