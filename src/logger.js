/* eslint no-console: 0 */
const loggerEnabled = process.env.LOGGER_ENABLED === "true"
const chalk = require("chalk")

function info(msg) {
    if (loggerEnabled) {
        console.log(chalk.blue(` INFO ${msg}`))
    }
}

function warn(msg) {
    if (loggerEnabled) {
        console.log(chalk.yellow(` WARN ${msg}`))
    }
}

function error(msg) {
    if (loggerEnabled) {
        console.log(chalk.red(`${chalk.bold("ERROR")} ${msg}`))
    }
}

module.exports = {
    enabled: loggerEnabled,
    info: info,
    warn: warn,
    error: error,
    rest: function (req, res, err) {
        if (loggerEnabled) {
            let diff = process.hrtime(req.start)
            diff = Math.round((diff[0] * 1e9 + diff[1]) / 1000000)

            let time = `${diff}ms`
            if (diff > 200) {
                time = chalk.red(time)
            } else if (time > 100) {
                time = chalk.yellow(time)
            } else {
                time = chalk.green(time)
            }

            let msg = `${res.statusCode} ${req.method} ${req.url} ${time}`
            if (err) {
                msg += " " + err.message
            }

            switch (res.statusCode) {
            default: info(chalk.green(msg))
                break
            case 404:
            case 405:
                warn(chalk.green(msg))
                break
            case 500:
                error(msg)
                break
            }
        }
    }
}
