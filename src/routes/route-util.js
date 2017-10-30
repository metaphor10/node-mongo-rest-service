const zlib = require("zlib")
const logger = require("../logger")

function getRequestBody(req, callback) {
    let body = []
    req
        .on("data", (chunk) => {
            body.push(chunk)
        })
        .on("end", () => {
            body = Buffer.concat(body).toString()

            try {
                body = JSON.parse(body)
            } catch (err) {
                callback(err)
                return
            }

            callback(undefined, body)
        })
}

const headers = {
    "Content-Type": "application/json"
}

const headersDeflate = {
    "Content-Type": "application/json",
    "Content-Encoding": "deflate"
}

const headersGZip = {
    "Content-Type": "application/json",
    "Content-Encoding": "gzip"
}

const itemRouteAllowHeaders = {
    Allow: "HEAD, GET, PUT, POST, PATCH, DELETE"
}

const collectionRouteAllowHeaders = {
    Allow: "HEAD, GET, PUT, PATCH, DELETE"
}

function sendResponse(req, res, body) {
    let acceptEncoding = req.headers["accept-encoding"]

    if (body) {
        body = JSON.stringify(body)
    } else {
        body = ""
    }

    try {
        if (acceptEncoding) {
            if (acceptEncoding.indexOf("deflate") != -1) {
                res.writeHead(200, headersDeflate)
                let deflateStream = zlib.createDeflate()
                deflateStream.pipe(res)
                    .on("finish", () => {
                        logger.rest(req, res)
                    })
                deflateStream.end(body)
            } else if (acceptEncoding.indexOf("gzip") != -1) {
                res.writeHead(200, headersGZip)
                let gzipStream = zlib.createGzip()
                gzipStream.pipe(res)
                    .on("finish", () => {
                        logger.rest(req, res)
                    })
                gzipStream.end(body)
            } else {
                res.writeHead(200, headers)
                res.end(body)
                logger.rest(req, res)
            }
        } else {
            res.writeHead(200, headers)
            res.end(body)
            logger.rest(req, res)
        }
    } catch (err) {
        /* istanbul ignore next */
        sendInternalServerErrorResponse(req, res, err)
    }
}

function sendSuccessResponse(req, res) {
    res.writeHead(200)
    res.end()
    logger.rest(req, res)
}

function sendNotFoundResponse(req, res) {
    res.writeHead(404)
    res.end()
    logger.rest(req, res)
}

function sendInternalServerErrorResponse(req, res, err) {
    res.writeHead(500)
    res.end()
    logger.rest(req, res, err)
}

function sendBadRequestResponse(req, res, message) {
    res.writeHead(400)
    res.end(`{"message": "${message}"}`)
    logger.rest(req, res)
}

module.exports = {
    getRequestBody: getRequestBody,
    headers: headers,
    headersGZip: headersGZip,
    headersDeflate: headersDeflate,
    itemRouteAllowHeaders: itemRouteAllowHeaders,
    collectionRouteAllowHeaders: collectionRouteAllowHeaders,
    sendResponse: sendResponse,
    sendSuccessResponse: sendSuccessResponse,
    sendNotFoundResponse: sendNotFoundResponse,
    sendInternalServerErrorResponse: sendInternalServerErrorResponse,
    sendBadRequestResponse: sendBadRequestResponse
}
