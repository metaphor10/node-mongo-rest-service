const ObjectID = require("mongodb").ObjectID
const routeUtil = require("./route-util")
const queryStringParser = require("./query-string")

module.exports = function getItem(collection, itemID, queryString, req, res) {
    try {
        itemID = new ObjectID(itemID)
    } catch (err) {
        routeUtil.sendNotFoundResponse(req, res)
        return
    }

    let options = undefined
    let fields = queryStringParser.fields(queryString)
    if (fields) {
        options = {
            fields: fields
        }
    }

    collection.findOne({
        _id: itemID
    }, options, (err, doc) => {
        /* istanbul ignore if */
        if (err) {
            routeUtil.sendInternalServerErrorResponse(req, res, err)
        } else if (doc) {
            routeUtil.sendResponse(req, res, doc)
        } else {
            routeUtil.sendNotFoundResponse(req, res)
        }
    })
}
