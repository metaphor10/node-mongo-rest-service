const ObjectID = require("mongodb").ObjectID
const routeUtil = require("./route-util")

module.exports = function headItem(collection, itemID, queryString, req, res) {
    try {
        itemID = new ObjectID(itemID)
    } catch (err) {
        routeUtil.sendNotFoundResponse(req, res)
        return
    }

    routeUtil.sendResponse(req, res)
}
