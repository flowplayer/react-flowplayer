import { hydrateRoot } from "react-dom/client"
import App from "./app"
import * as React from "react"


hydrateRoot(document.getElementById("root")!, <App />)