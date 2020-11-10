import React, { useEffect, useRef } from "react"

// TODO: fix this when flowplayer is in NPM
// import flowplayer from "@flowplayer/player"
const flowplayer = window.flowplayer

type FlowplayerProps = { // TODO: take types from Flowplayer NPM package
    src: any,
    token: string
}

const Flowplayer = React.forwardRef<HTMLDivElement, FlowplayerProps>((opts, forwardedRef) => {
    const ref = forwardedRef === null ? useRef(null) : forwardedRef
    // Init Flowplayer on mount
    useEffect(() => {
        if (typeof ref === "function") return
        if (!ref) return
        if (!ref.current) return
        const api = flowplayer(ref.current, opts)
        return () => {
            api.destroy()
        }
    }, [ref])
    
    return <div ref={ref} />
})

export default Flowplayer