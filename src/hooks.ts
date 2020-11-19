import { RefObject, useEffect, useMemo, useState } from "react";
import flowplayer from "@flowplayer/player"

/**
 * Hook to use Flowplayer API in an async way - tries to solve the chicken/egg problem
 */
export const useFlowplayer = (ref: RefObject<HTMLDivElement>) => {
    // Store flowplayer instances to a state value in order to force re-renders when new instances are available
    const [flowplayerInstances, setFlowplayerInstances] = useState((flowplayer ? flowplayer.instances : []) || [])
    // Remember the API as long as flowplayer instances are not changing
    const api = useMemo(() => {
        if (!ref.current) return null
        return flowplayer(ref.current)
    }, [flowplayerInstances])

    // Either check if API is available at this state or then wait for one to be created
    useEffect(() => {
        // If API is already created we don't need the extension
        if (ref.current && (flowplayer.instances as any[]).some(instance => instance.root == ref.current)) {
            setFlowplayerInstances(flowplayer.instances.slice())
            return () => {}
        }
        // API not created - wait for creation
        const reactDetectExtension = () => {
            setFlowplayerInstances(flowplayer.instances.slice()) // Create a copy to not use the same reference
        }
        flowplayer(reactDetectExtension)
        return () => {
            (flowplayer.extensions as any[]).filter(ext => ext !== reactDetectExtension)
        }
    }, [])
    return api
}