const ObjectID = require("mongodb").ObjectID
const routeUtil = require("./route-util")

const upsertOptions = {
    upsert: true
}

module.exports = function putItem(collection, itemID, queryString, req, res) {
    try {
        itemID = new ObjectID(itemID)
    } catch (err) {
        routeUtil.sendNotFoundResponse(req, res)
        return
    }

    routeUtil.getRequestBody(req, (err, body) => {
        /* istanbul ignore if */
        if (err) {
            routeUtil.sendInternalServerErrorResponse(req, res, err)
        } else {
            body._id = itemID
            collection.findOneAndReplace({
                _id: itemID
            }, upsertOptions, body, (err, result) => {
                /* istanbul ignore if */
                if (err) {
                    routeUtil.sendInternalServerErrorResponse(req, res, err)
                } else if (result.lastErrorObject.n > 0) {
                    routeUtil.sendSuccessResponse(req, res)
                } else {
                    routeUtil.sendNotFoundResponse(req, res)
                }
            })
        }
    })
}
