require("should")

const mongo = require("../src/mongo")

function seedCollection(collectionName, data) {
    const clonedData = JSON.parse(JSON.stringify(data))
    const collection = mongo.collection(collectionName)

    return collection.deleteMany({})
        .catch(() => {})
        .then(() => {
            return collection.insertMany(clonedData)
        })
        .then((result) => {
            let results = result.ops
            for (let i = 0, len = results.length; i < len; i++) {
                results[i]._id = results[i]._id.toString()
            }
            return result.ops
        })
}

function getCollectionItems(collectionName, filter = {}) {
    return mongo.collection(collectionName).filter(filter).toArray()
}

function collectionShouldEqual(collectionName, expected, filter = {}) {
    return mongo.collection(collectionName).find(filter).toArray()
        .then((items) => {
            items.forEach((item) => {
                item._id = item._id.toString()
            })
            items.should.deepEqual(expected)
            return items
        })
}

module.exports = {
    seedCollection: seedCollection,
    getCollectionItems: getCollectionItems,
    collectionShouldEqual: collectionShouldEqual
}
