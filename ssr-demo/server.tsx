import { createServer} from "http"
import { renderToString } from "react-dom/server"
import * as React from "react"
import { createReadStream} from "fs"
import { join } from "path"
import App from "./app"

const server = createServer((req, res) => {
  switch (req.url) {
    case "/":
      res.statusCode = 200
      res.setHeader("Content-Type", "text/html")
      res.write("<!doctype html><html><head><title>SSR Demo</title></head><body><div id=\"root\">") 

      const str = renderToString(<App />)
      res.write(str)
      res.write("</div><script src=\"index.js\"></script></body></html>")
      res.end()
      break
    case "/index.js":
      res.statusCode = 200
      res.setHeader("Content-Type", "application/javascript")
      const jsStream = createReadStream(join(__dirname, "client.js"))
      jsStream.pipe(res)
      break
    default:
      res.statusCode = 404
      res.write("Not found")
      res.end()
  }
})

server.listen(8844, () => {
  console.log("Server running at http://localhost:8844")
})
