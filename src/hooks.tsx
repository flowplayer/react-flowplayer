import type { RCConfigUI, RCFlowplayerProps } from "./types/flowplayer-ui";

import React, { useEffect, useMemo, useRef, useState } from "react";
import flowplayer, { Config } from "@flowplayer/player";
import FlowplayerComponent from "./flowplayer";
import { Plugin } from "@flowplayer/player/plugin";

// - Constants
enum ConfigUI {
  logoOnRight = 8,
  noControls = 1024,
  noDescription = 512,
  noDuration = 2048,
  noFullscreen = 1,
  noHeader = 4096,
  noMute = 4,
  noTitle = 256,
  noVolumeControl = 2,
  useDragHandle = 16,
  usePlay2 = 32,
  usePlay3 = 64,
  useThinControlBar = 128,
}

// - Types
type ConfigUIKey = keyof typeof ConfigUI;

// - Methods
const convertUIConfigToBitmask = (uiConfig?: Partial<RCConfigUI>): number => {
  if (!uiConfig) return 0;
  const uiConfigKeys: [ConfigUIKey] = Object.keys(uiConfig) as [ConfigUIKey];

  const bitmask = uiConfigKeys.reduce((val, key) => {
    const option = ConfigUI[key];
    const isActive = uiConfig[key];
    return isActive ? val | option : val;
  }, 0);

  return bitmask;
};

// - Components
// FIXME: Do we need this wrapper function at all?
const hookFlowplayer = (
  ref: React.RefObject<HTMLDivElement>,
  token: string,
  opts?: Config,
  ui?: number,
) => {
  return <FlowplayerComponent token={token} ref={ref} {...opts} ui={ui} />;
};

/**
 * Hook to use Flowplayer API in an async way - tries to solve the chicken/egg problem
 */
const useFlowplayerHook = ({ token }: { token: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Store flowplayer instances to a state value in order to force re-renders when new instances are available
  const [flowplayerInstances, setFlowplayerInstances] = useState(flowplayer.instances.slice());

  const ReactFlowplayerDetectExtension = useMemo(
    () =>
      class implements Plugin {
        init() {
          setFlowplayerInstances(flowplayer.instances.slice());
        }
      },
    [],
  );

  // Detect new flowplayer instances to keep up to date
  useEffect(() => {
    // If API is already created we don't need the extension
    if (
      ref.current &&
      (flowplayer.instances as any[]).some((instance) => instance.root == ref.current)
    ) {
      setFlowplayerInstances(flowplayer.instances.slice());
      return () => {};
    }
    flowplayer(ReactFlowplayerDetectExtension);
    return () => {
      (flowplayer.extensions as any[]).filter((ext) => ext !== ReactFlowplayerDetectExtension);
    };
  }, []);

  /// Wrapped Flowplayer comp so that we can expose public props
  const RCFlowplayer = ({ uiConfig, ...opts }: RCFlowplayerProps) => {
    if (!token) return null;

    const Flowplayer = useMemo(() => {
      if (!token) return null;
      return hookFlowplayer(ref, token, opts, convertUIConfigToBitmask(uiConfig));
    }, [token, ref]);

    return Flowplayer;
  };

  return useMemo(() => {
    if (!RCFlowplayer) return { Flowplayer: (opts: Config) => null, api: null };
    return {
      Flowplayer: RCFlowplayer,
      api: ref.current ? flowplayer(ref.current) : null,
    };
  }, [RCFlowplayer, flowplayerInstances]);
};

// - Exports
export const useFlowplayer = useFlowplayerHook;
export type FlowplayerProps = RCFlowplayerProps;
export type FlowplayerConfigUI = RCConfigUI