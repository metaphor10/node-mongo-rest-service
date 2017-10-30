const mongo = require("./mongo")
const databaseCollections = require("./routes/database-collections")
const optionsCollection = require("./routes/options-collection")
const optionsItem = require("./routes/options-item")
const headCollection = require("./routes/head-collection")
const headItem = require("./routes/head-item")
const getCollection = require("./routes/get-collection")
const getItem = require("./routes/get-item")
const postCollection = require("./routes/post-collection")
const postItem = require("./routes/post-item")
const putCollection = require("./routes/put-collection")
const putItem = require("./routes/put-item")
const patchCollection = require("./routes/patch-collection")
const patchItem = require("./routes/patch-item")
const deleteCollection = require("./routes/delete-collection")
const deleteItem = require("./routes/delete-item")
const routeUtil = require("./routes/route-util")
const logger = require("./logger")

function handleRequest(req, res) {
    if (logger.enabled) {
        req.start = process.hrtime()
    }

    let url = req.url

    let queryString
    let queryStringIndex = url.indexOf("?")
    if (queryStringIndex != -1) {
        queryString = url.substr(queryStringIndex + 1)
        url = url.substr(0, queryStringIndex)
    }

    let collectionName
    let collectionDelimiterIndex = url.indexOf("/", 1)
    if (collectionDelimiterIndex === -1) {
        if (url.length == 1) {
            databaseCollections(req, res)
            return
        } else {
            collectionName = url.substr(1)
        }
    } else {
        collectionName = url.substr(1, collectionDelimiterIndex - 1)
    }

    let itemID
    if (collectionDelimiterIndex + 1 != url.length && collectionDelimiterIndex != -1) {
        itemID = url.substr(collectionDelimiterIndex + 1)
    }

    let collection = mongo.collection(collectionName)

    switch (req.method) {
    case "OPTIONS":
        if (itemID) {
            optionsItem(collection, itemID, queryString, req, res)
        } else {
            optionsCollection(collection, queryString, req, res)
        }
        break
    case "HEAD":
        if (itemID) {
            headItem(collection, itemID, queryString, req, res)
        } else {
            headCollection(collection, queryString, req, res)
        }
        break
    case "GET":
        if (itemID) {
            getItem(collection, itemID, queryString, req, res)
        } else {
            getCollection(collection, queryString, req, res)
        }
        break
    case "PUT":
        if (itemID) {
            putItem(collection, itemID, queryString, req, res)
        } else {
            putCollection(collection, queryString, req, res)
        }
        break
    case "POST":
        if (itemID) {
            postItem(collection, itemID, queryString, req, res)
        } else {
            postCollection(collection, queryString, req, res)
        }
        break
    case "PATCH":
        if (itemID) {
            patchItem(collection, itemID, queryString, req, res)
        } else {
            patchCollection(collection, queryString, req, res)
        }
        break
    case "DELETE":
        if (itemID) {
            deleteItem(collection, itemID, queryString, req, res)
        } else {
            deleteCollection(collection, queryString, req, res)
        }
        break
    default:
        if (itemID) {
            res.writeHead(405, routeUtil.itemRouteAllowHeaders)
        } else {
            res.writeHead(405, routeUtil.collectionRouteAllowHeaders)
        }
        res.end()
        logger.rest(req, res)
        break
    }
}

module.exports = handleRequest
