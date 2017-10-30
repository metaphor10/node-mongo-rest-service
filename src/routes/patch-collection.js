const routeUtil = require("./route-util")
const queryStringParser = require("./query-string")

module.exports = function patchCollection(collection, queryString, req, res) {
    let filter = undefined
    try {
        filter = queryStringParser.parse(queryString).filter
    } catch (err) {
        routeUtil.sendBadRequestResponse(req, res, err.message)
        return
    }

    if (!filter) {
        filter = {}
    }

    routeUtil.getRequestBody(req, (err, body) => {
        /* istanbul ignore if */
        if (err) {
            routeUtil.sendInternalServerErrorResponse(req, res, err)
        } else {
            collection.updateMany(filter, {
                $set: body
            }, (err) => {
                /* istanbul ignore if */
                if (err) {
                    routeUtil.sendInternalServerErrorResponse(req, res, err)
                } else {
                    routeUtil.sendSuccessResponse(req, res)
                }
            })
        }
    })
}
