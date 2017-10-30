const routeUtil = require("./route-util")

module.exports = function postCollection(collection, queryString, req, res) {
    routeUtil.getRequestBody(req, (err, body) => {
        /* istanbul ignore if */
        if (err) {
            routeUtil.sendInternalServerErrorResponse(req, res, err)
        } else {
            collection.insertOne(body, (err, result) => {
                /* istanbul ignore if */
                if (err) {
                    routeUtil.sendInternalServerErrorResponse(req, res, err)
                } else {
                    routeUtil.sendResponse(req, res, result.ops[0])
                }
            })
        }
    })
}
