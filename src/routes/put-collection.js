const routeUtil = require("./route-util")
const queryStringParser = require("./query-string")

module.exports = function putCollection(collection, queryString, req, res) {
    let filter = undefined
    try {
        filter = queryStringParser.parse(queryString).filter
    } catch (err) {
        routeUtil.sendBadRequestResponse(req, res, err.message)
        return
    }

    routeUtil.getRequestBody(req, (err, body) => {
        /* istanbul ignore if */
        if (err) {
            routeUtil.sendInternalServerErrorResponse(req, res, err)
        } else {
            if (body.constructor !== Array) {
                routeUtil.sendBadRequestResponse(req, res, "Request body must be an array")
            } else {
                collection.deleteMany(filter, (err) => {
                    /* istanbul ignore if */
                    if (err) {
                        routeUtil.sendInternalServerErrorResponse(req, res, err)
                    } else {
                        collection.insertMany(body, (err) => {
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
        }
    })
}
