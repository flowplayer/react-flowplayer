import React, { useRef, forwardRef, useEffect } from "react"

// TODO: fix this when flowplayer is in NPM
// import flowplayer from "@flowplayer/player"
const flowplayer = window.flowplayer

type FlowplayerProps = { // TODO: take types from Flowplayer NPM package
    src: any,
    token: string
}

const Flowplayer = React.forwardRef<HTMLDivElement, FlowplayerProps>((opts, forwardedRef) => {
    // Init Flowplayer on mount
    useEffect(() => {
        if (typeof forwardedRef === "function") return
        if (!forwardedRef) return
        if (!forwardedRef.current) return
        flowplayer(forwardedRef.current, opts)
    }, [forwardedRef])
    
    return <div ref={forwardedRef} />
})

export default Flowplayer