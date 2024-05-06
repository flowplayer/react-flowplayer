import type { ForwardedRef } from "react";
import type { Config, ConfigWith } from "@flowplayer/player";

import React, { useEffect, forwardRef, useRef, useImperativeHandle } from "react";
import flowplayer from "@flowplayer/player";

type KeyValue = Record<string, any>;

// - Types
type Props = {
  token: Config["token"],
  src: Config["src"],
  // allow custom plugin config
  opts?: Omit<Config, "token" | "src"> & KeyValue
}

// - Components
const Flowplayer = (props: Props, receivedRef: ForwardedRef<HTMLDivElement>) => {
  const { token, src, opts } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const playerApi = () => (ref?.current ? flowplayer(ref.current) : null);

  useImperativeHandle(receivedRef, () => ref?.current as any);

  // Init Flowplayer on mount
  useEffect(() => {
    if (typeof ref === "function") return;
    if (!ref) return;
    if (!ref.current) return;
    if (!token) return;
    const api = flowplayer(ref?.current, { token, ...opts });
    return () => {
      api.destroy();
      if (ref?.current) ref.current.innerHTML = "";
    };
  }, [token, ref]);

  useEffect(() => {
    if (!opts) return;
    const api = playerApi();
    api?.setOpts(opts);
  }, [opts]);

  useEffect(() => {
    if (!src) return;
    const api = playerApi();
    api?.setSrc(src);
  }, [src]);

  return <div ref={ref} />;
};

// - Exports
Flowplayer.displayName = "Flowplayer";
export type FlowplayerProps = Props;
export default forwardRef<HTMLDivElement, Props>(Flowplayer);
