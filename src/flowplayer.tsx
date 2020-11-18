import React, { useEffect, useRef } from "react"
import flowplayer, { Flowplayer } from "@flowplayer/player"
import { useFlowplayer } from "./hooks"

type FlowplayerProps = { // TODO: take types from Flowplayer NPM package
    src: any,
    token: string
}

const Flowplayer = React.forwardRef<HTMLDivElement, Flowplayer.Config>((opts, forwardedRef) => {
    const ref = forwardedRef === null ? useRef(null) : forwardedRef

    const { src, ...rest } = opts
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

    const useApi = () => ref && typeof ref !== "function" &&  ref.current ? flowplayer(ref.current) : null

    useEffect(() => {
        const api = useApi()
        if (!api) return
        api.setOpts(rest)
    }, [rest])

    useEffect(() => {
        const api = useApi()
        if (!api || !src) return
        api.setSrc(src)
    }, [src])
    
    return <div ref={ref} />
})

export default Flowplayer