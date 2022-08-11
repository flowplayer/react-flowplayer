import { RefObject, useEffect, useMemo, useState } from "react";
import flowplayer from "@flowplayer/player";
import { Plugin } from "@flowplayer/player/plugin";

/**
 * Hook to use Flowplayer API in an async way - tries to solve the chicken/egg problem
 */
export const useFlowplayer = (ref: RefObject<HTMLDivElement>) => {
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
      ref?.current &&
      (flowplayer.instances as any[]).some((instance) => instance.root == ref?.current)
    ) {
      setFlowplayerInstances(flowplayer.instances.slice());
      return () => {};
    }
    flowplayer(ReactFlowplayerDetectExtension);
    return () => {
      (flowplayer.extensions as any[]).filter((ext) => ext !== ReactFlowplayerDetectExtension);
    };
  }, []);

  return useMemo(() => {
    return ref?.current ? flowplayer(ref.current) : null;
  }, [flowplayerInstances]);
};