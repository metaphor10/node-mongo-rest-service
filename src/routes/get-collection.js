const JSONStream = require("JSONStream")
const zlib = require("zlib")
const logger = require("../logger")
const routeUtil = require("./route-util")
const queryStringParser = require("./query-string")

module.exports = function getCollection(collection, queryString, req, res) {
    let query = undefined
    try {
        query = queryStringParser.parse(queryString)
    } catch (err) {
        routeUtil.sendBadRequestResponse(req, res, err.message)
        return
    }

    const cursor = collection.find(query.filter)

    if (query.skip) {
        cursor.skip(query.skip)
    }

    if (query.limit) {
        cursor.limit(query.limit)
    }

    if (query.fields) {
        cursor.project(query.fields)
    }

    if (query.sort) {
        cursor.sort(query.sort)
    }

    let acceptEncoding = req.headers["accept-encoding"]

    try {
        if (acceptEncoding) {
            if (acceptEncoding.indexOf("deflate") != -1) {
                res.writeHead(200, routeUtil.headersDeflate)
                cursor.stream().pipe(JSONStream.stringify()).pipe(zlib.createDeflate()).pipe(res)
                    .on("finish", () => {
                        logger.rest(req, res)
                    })
            } else if (acceptEncoding.indexOf("gzip") != -1) {
                res.writeHead(200, routeUtil.headersGZip)
                cursor.stream().pipe(JSONStream.stringify()).pipe(zlib.createGzip()).pipe(res)
                    .on("finish", () => {
                        logger.rest(req, res)
                    })
            } else {
                res.writeHead(200, routeUtil.headers)
                cursor.stream().pipe(JSONStream.stringify()).pipe(res)
                    .on("finish", () => {
                        logger.rest(req, res)
                    })
            }
        } else {
            res.writeHead(200, routeUtil.headers)
            cursor.stream().pipe(JSONStream.stringify()).pipe(res)
                .on("finish", () => {
                    logger.rest(req, res)
                })
        }
    } catch (err) {
        /* istanbul ignore next */
        routeUtil.sendInternalServerErrorResponse(req, res, err)
    }
}
