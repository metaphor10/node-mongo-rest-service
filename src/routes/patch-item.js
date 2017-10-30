const routeUtil = require("./route-util")
const ObjectID = require("mongodb").ObjectID

module.exports = function patchItem(collection, itemID, queryString, req, res) {
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
            collection.findOneAndReplace({
                _id: itemID
            }, {
                $set: body
            }, {
                returnOriginal: false
            }, (err, result) => {
                /* istanbul ignore if */
                if (err) {
                    routeUtil.sendInternalServerErrorResponse(req, res, err)
                } else {
                    if (result.value) {
                        routeUtil.sendResponse(req, res, result.value)
                    } else {
                        routeUtil.sendNotFoundResponse(req, res)
                    }
                }
            })
        }
    })
}
