import type { ForwardedRef } from "react";
import { type Config, type ConfigWith, type FlowplayerUMD } from "@flowplayer/player";

import { useEffect, forwardRef, useRef, useImperativeHandle, useMemo, useState } from "react";
import * as React from "react"

// - Types
type Props = {
  token: Config["token"],
  src: Config["src"],
  opts?: Omit<ConfigWith<any>, "token" | "src">
}

// - Components
const Flowplayer = (props: Props, receivedRef: ForwardedRef<HTMLDivElement>) => {
  const { token, src, opts } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const [flowplayer, setFlowplayer] = useState<FlowplayerUMD | null>(null)
  const playerApi = useMemo(() => () => ((ref?.current && flowplayer) ? flowplayer(ref.current) : null), [flowplayer]);
  console.log("here")
  useEffect(() => {
    if (!canUseDOM()) return
    import("@flowplayer/player").then(umd => {
      setFlowplayer(umd.flowplayer)
    }).catch(() => {
      console.warn("Unable to dynamically import flowplayer")
    })
  }, [])

  useImperativeHandle(receivedRef, () => ref?.current as any);

  // Init Flowplayer on mount
  useEffect(() => {
    if (typeof ref === "function") return;
    if (!ref) return;
    if (!ref.current) return;
    if (!token) return;
    if (!flowplayer) return;
    const api = flowplayer(ref?.current, { token, ...opts });
    return () => {
      api.destroy();
      if (ref?.current) ref.current.innerHTML = "";
    };
  }, [token, ref, flowplayer]);

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


function canUseDOM() {
  try {
    // eslint-disable-next-line
    const temp = navigator.userAgent
    return true 
  } catch (e) {
    return false
  }
}