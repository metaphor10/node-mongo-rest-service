const ObjectID = require("mongodb").ObjectID
const routeUtil = require("./route-util")

module.exports = function deleteItem(collection, itemID, queryString, req, res) {
    try {
        itemID = new ObjectID(itemID)
    } catch (err) {
        routeUtil.sendNotFoundResponse(req, res)
        return
    }

    collection.deleteOne({
        _id: itemID
    }, (err, result) => {
        /* istanbul ignore if */
        if (err) {
            routeUtil.sendInternalServerErrorResponse(req, res, err)
        } else if (result.result.n > 0) {
            routeUtil.sendSuccessResponse(req, res)
        } else {
            routeUtil.sendNotFoundResponse(req, res)
        }
    })
}
