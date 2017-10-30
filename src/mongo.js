const mongoClient = require("mongodb").MongoClient
const collections = {}
const logger = require("./logger")
let database

let connection = mongoClient.connect(process.env.MONGO_CONNECTION_STRING || "mongodb://localhost:27017/database")
    .then((db) => {
        logger.info(`database '${db.databaseName}' connected`)
        database = db
        return db
    })
    .catch((err) => {
        logger.error(`database connect failed: ${err.message}`)
        throw err
    })

function connect() {
    return connection
}

function close() {
    if (!database) {
        return Promise.resolve()
    }

    let db = database
    let promise = database.close()
        .then(() => {
            logger.info(`database '${db.databaseName}' closed`)
        })
        .catch(() => {})

    database = null
    connection = null

    return promise
}

function getCollection(collectionName) {
    let collection = collections[collectionName]

    if (!collection) {
        collection = database.collection(collectionName)
        collections[collectionName] = collection
    }

    return collection
}

module.exports = {
    connect: connect,
    close: close,
    collection: getCollection
}
