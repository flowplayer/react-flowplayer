import type { ForwardedRef } from "react";
import type { Config } from "@flowplayer/player";

import React, { useEffect, forwardRef, useRef, useImperativeHandle } from "react";
import flowplayer from "@flowplayer/player";

const Flowplayer = (props: Config, receivedRef: ForwardedRef<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { token, src, ...rest } = props;
  const playerApi = () => (ref?.current ? flowplayer(ref.current) : null);

  useImperativeHandle(receivedRef, () => ref?.current as any);

  // Init Flowplayer on mount
  useEffect(() => {
    if (typeof ref === "function") return;
    if (!ref) return;
    if (!ref.current) return;
    if (!token) return;
    const api = flowplayer(ref?.current, { token, ...props });
    return () => {
      api.destroy();
      if (ref?.current) ref.current.innerHTML = "";
    };
  }, [token, ref]);

  useEffect(() => {
    const api = playerApi();
    api?.setOpts(rest);
  }, [props]);

  useEffect(() => {
    if (!src) return;
    const api = playerApi();
    api?.setSrc(src);
  }, [src]);

  return <div ref={ref} />;
};

Flowplayer.displayName = "Flowplayer";
export default forwardRef<HTMLDivElement, Config>(Flowplayer);
