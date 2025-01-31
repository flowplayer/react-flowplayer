import { RefObject, useEffect, useState } from "react";
import flowplayer, { type Player } from "@flowplayer/player";

export const useFlowplayer = (ref: RefObject<HTMLDivElement>) => {

  const [player, setPlayer] = useState<Player>();

  useEffect(() => {
    if (ref.current) {
      const newPlayer = flowplayer(ref.current);
      setPlayer(newPlayer);
    }
  }, [ref]);

  return player;
};