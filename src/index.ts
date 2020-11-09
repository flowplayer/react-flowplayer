import Flowplayer from "./flowplayer"
import {
    useFlowplayer
} from "./hooks"

export default Flowplayer
export {
    useFlowplayer
}

// TODO: remove this
declare global {
    interface Window {
        flowplayer: any
    }
}