import { expectType, expectError } from "tsd";
import Flowplayer, { useFlowplayer } from "../lib";
import React, { RefObject, useRef } from "react";
import { Player } from "@flowplayer/player";

// - useFlowplayer returns Player instance -
const playerRef = useRef<HTMLDivElement|null>(null);
const playerApi = useFlowplayer(playerRef as RefObject<HTMLDivElement>);
expectType<Player | null>(playerApi);

// - basic initalization -
const _uplayer = (
  <Flowplayer src={"demoSrc"} token={"DEMO_TOKEN"} ref={playerRef} />
);

// - missing src throws err -
expectError(<Flowplayer token={"DEMO_TOKEN"} ref={playerRef} />);

// - opts basic -
const _uplayerWithOpts = (
  <Flowplayer
    src={"demoSrc"}
    token={"DEMO_TOKEN"}
    ref={playerRef}
    opts={{
      title: "Example title",
      description: "Example description",
      autopause: true,
    }}
  />
);

// - opts with plugins -
const _uplayerWithPlugins = (
  <Flowplayer
    src={"demoSrc"}
    token={"DEMO_TOKEN"}
    ref={playerRef}
    opts={{
      title: "Example title",
      description: "Example description",
      cueponts: [
        {
          startTime: 1,
          endTime: 2,
          text: "df",
        },
      ],
    }}
  />
);

// - opts wrong types  -
expectError(
  <Flowplayer
    src={"demoSrc"}
    token={"DEMO_TOKEN"}
    ref={playerRef}
    opts={{
      title: 2,
    }}
  />,
);
