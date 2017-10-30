const http = require("http")
const app = require("./app")
const mongo = require("./mongo")
const cluster = require("cluster")
const logger = require("./logger")
let server

function closeServer() {
    if (server) {
        return new Promise((resolve) => {
            server.close(() => {
                resolve()
            })
            server = null
        })
    } else {
        return Promise.resolve()
    }
}

function shutdown(code = 0, disconnect = false) {
    closeServer()
        .then(() => {
            return mongo.close()
        })
        .then(() => {
            if (cluster.worker && disconnect) {
                logger.info("cluster worker disconnect")
                cluster.worker.disconnect()
            }

            process.exit(code)
        })
}

process.stdin.resume() // so the program will not close instantly
process.on("exit", shutdown) // do something when app is closing
process.on("SIGINT", shutdown) // catches ctrl+c event
process.on("uncaughtException", function (err) {
    if (err.errno === "EADDRINUSE") {
        logger.error("server listen failed: port in use, exiting...")
        shutdown(1, true)
    } else {
        logger.error(`uncaughtException: ${err.message}`)
        shutdown(1)
    }
})

if (cluster.worker) { // handles when cluster disconnects worker
    cluster.worker.on("disconnect", shutdown)
}

mongo.connect()
    .then(() => {
        server = http.createServer(app)
        server.on("error", function (err) {
            if (err.errno === "EADDRINUSE") {
                logger.error("server listen failed: port in use, exiting...")
                shutdown(1, true)
            } else {
                logger.error(`server error: ${err.message}`)
                shutdown(1)
            }
        })
        server.on("clientError", function (err, socket) {
            socket.end("HTTP/1.1 400 Bad Request\r\n\r\n")
        })
        server.on("close", function () {
            logger.info("server closed")
        })
        server.listen(process.env.PORT || 3000, () => {
            logger.info(`server listening on ${process.env.PORT || 3000}`)
        })
    })
    .catch(() => {
        shutdown(1, true)
    })
