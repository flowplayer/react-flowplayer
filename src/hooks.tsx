import React, { useEffect, useMemo, useRef, useState } from "react";
import flowplayer, { Config } from "@flowplayer/player"
import FlowplayerComponent from "./flowplayer";
import { Plugin } from "@flowplayer/player/plugin";

/**
 * Hook to use Flowplayer API in an async way - tries to solve the chicken/egg problem
 */
export const useFlowplayer = ({ token } : { token: string }) => {
    const ref = useRef<HTMLDivElement>(null)
    
    // Store flowplayer instances to a state value in order to force re-renders when new instances are available
    const [flowplayerInstances, setFlowplayerInstances] = useState(flowplayer.instances.slice())


    const ReactFlowplayerDetectExtension = useMemo(() => class implements Plugin {
        init() {
            setFlowplayerInstances(flowplayer.instances.slice())
        }
    }, [])
    
    // Detect new flowplayer instances to keep up to date
    useEffect(() => {
        // If API is already created we don't need the extension
        if (ref.current && (flowplayer.instances as any[]).some(instance => instance.root == ref.current)) {
            setFlowplayerInstances(flowplayer.instances.slice())
            return () => {}
        }
        flowplayer(ReactFlowplayerDetectExtension)
        return () => {
            (flowplayer.extensions as any[]).filter(ext => ext !== ReactFlowplayerDetectExtension)
        }
    }, [])
    
    const Flowplayer = useMemo(() => {
        if (!token) return null
        return hookFlowplayer(ref, token)
    }, [token, ref])
    
    return useMemo(() => {
        if (!Flowplayer) return { Flowplayer: (opts: Config) => null, api: null }
        return {
            Flowplayer,
            api: ref.current ? flowplayer(ref.current) : null
        }
    }, [Flowplayer, flowplayerInstances])
}

const hookFlowplayer = (ref: React.RefObject<HTMLDivElement>, token: string) => {
    return (opts: Config) => <FlowplayerComponent token={token} ref ={ref} {...opts} />
}