const routeUtil = require("./route-util")
const queryStringParser = require("./query-string")

module.exports = function deleteCollection(collection, queryString, req, res) {
    let filter = undefined
    try {
        filter = queryStringParser.parse(queryString).filter
    } catch (err) {
        routeUtil.sendBadRequestResponse(req, res, err.message)
        return
    }

    collection.deleteMany(filter, (err) => {
        /* istanbul ignore if */
        if (err) {
            routeUtil.sendInternalServerErrorResponse(req, res, err)
        } else {
            routeUtil.sendSuccessResponse(req, res)
        }
    })
}
