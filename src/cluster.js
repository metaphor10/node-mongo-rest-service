const logger = require("./logger"),
    cluster = require("cluster"),
    mongo = require("./mongo")

if (cluster.isMaster) {
    mongo.connect().then(() => {
        mongo.close().then(() => {
            let workerCount = require("os").cpus().length

            cluster.on("exit", (deadWorker, code, signal) => {
                if (deadWorker.exitedAfterDisconnect !== true) {
                    if (signal) {
                        logger.error(`cluster worker exited with signal ${signal}, restarting...`)
                    } else if (code !== 0) {
                        logger.error(`cluster worker exited with code ${code}, restarting...`)
                    }
                    cluster.fork()
                } else {
                    if (signal) {
                        logger.error(`cluster worker exited with signal ${signal} after disconnecting`)
                    } else if (code !== 0) {
                        logger.error(`cluster worker exited with code ${code} after disconnecting`)
                    } else {
                        logger.info("cluster worker exited after disconnecting")
                    }
                    workerCount -= 1
                    if (workerCount === 0) {
                        logger.info("cluster workers stopped, exiting...")
                        process.exit()
                    }
                }
            })

            logger.info(`cluster starting ${workerCount} workers`)
            for (let i = 0; i < workerCount; i += 1) {
                cluster.fork()
            }

            process.stdin.resume() // so the program will not close instantly
            process.on("exit", cluster.disconnect) // do something when app is closing
            process.on("SIGINT", cluster.disconnect) // catches ctrl+c event
            process.on("uncaughtException", (err) => {
                logger.error(`uncaughtException: ${err.message}`)
                cluster.disconnect()
            }) // catches uncaught exceptions
        })
    })
} else {
    logger.info("cluster worker started")
    require("./server")
}
