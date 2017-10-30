const routeUtil = require("./route-util")

module.exports = function headCollection(collection, queryString, req, res) {
    routeUtil.sendResponse(req,res)
}
