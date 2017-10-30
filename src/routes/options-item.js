const routeUtil = require("./route-util")
const logger = require("../logger")

module.exports = function optionsItem(collection, itemID, queryString, req, res) {
    res.writeHead(200, routeUtil.itemRouteAllowHeaders)
    res.end()
    logger.rest(req, res)
}
