const routeUtil = require("./route-util")
const logger = require("../logger")

module.exports = function optionsCollection(collection, queryString, req, res) {
    res.writeHead(200, routeUtil.collectionRouteAllowHeaders)
    res.end()
    logger.rest(req, res)
}
