const mongo = require("../mongo")
const routeUtil = require("./route-util")

let database

mongo.connect()
    .then((db) => {
        database = db
    })

module.exports = function databaseCollections(req, res) {
    database.listCollections({}).toArray(function (err, collections) {
        /* istanbul ignore if */
        if (err) {
            routeUtil.sendInternalServerErrorResponse(req, res, err)
        } else {
            routeUtil.sendResponse(req, res, collections.map((collection) => {
                return collection.name
            }))
        }
    })
}
