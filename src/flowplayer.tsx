import React, { useEffect, useRef } from "react"
import flowplayer, { Flowplayer } from "@flowplayer/player"

const Flowplayer = React.forwardRef<HTMLDivElement, Flowplayer.Config>((opts, forwardedRef) => {
    const ref = forwardedRef === null ? useRef(null) : forwardedRef

    const { token, src, ...rest } = opts
    // Init Flowplayer on mount
    useEffect(() => {
        if (typeof ref === "function") return
        if (!ref) return
        if (!ref.current) return
        if (!token) return
        const api = flowplayer(ref.current, {token,...opts})
        return () => {
            api.destroy()
            if (ref.current) ref.current.innerHTML = ""
        }
    }, [token, ref])

    const useApi = () => ref && typeof ref !== "function" &&  ref.current ? flowplayer(ref.current) : null

    useEffect(() => {
        const api = useApi()
        if (!api) return
        api.setOpts(rest)
    }, [opts])

    useEffect(() => {
        const api = useApi()
        if (!api || !src) return
        api.setSrc(src)
    }, [src])
    
    return <div ref={ref} />
})

export default Flowplayer