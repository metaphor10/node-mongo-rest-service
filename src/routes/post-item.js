const routeUtil = require("./route-util")
const logger = require("../logger")

module.exports = function postItem(collection, itemID, queryString, req, res) {
    res.writeHead(405, routeUtil.itemRouteAllowHeaders)
    res.end()
    logger.rest(req, res)
}
