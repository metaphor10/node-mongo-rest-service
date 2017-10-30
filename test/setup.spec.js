const mongo = require("../src/mongo")
const supertest = require("supertest")
const app = require("../src/app")
const logger = require("../src/logger")
const testMongo = require("./test-mongo")
const http = require("http")

before(function (done) {
    let context = this

    mongo.connect()
        .then(function () {
            if (logger.enabled) {
                console.log() // eslint-disable-line no-console
            }

            context.server = http.createServer(app).listen(() => {
                context.request = supertest(context.server)
                done()
            })
        })
})

beforeEach(function () {
    let context = this

    context.mockSource = [{
        name: "thing 1",
        group: "one",
        age: 1,
        hasStar: true
    }, {
        name: "thing 2",
        group: "one",
        age: 3,
        hasStar: false
    }, {
        name: "thing 3",
        group: "two",
        age: 2,
        hasStar: true
    }, {
        name: "thing 4",
        group: "two",
        age: 4,
        hasStar: false
    }]

    return testMongo.seedCollection("things", this.mockSource)
        .then(function (results) {
            context.mockData = results
        })
})

after(function (done) {
    this.server.close(() => {
        mongo.connect()
            .then((database) => {
                return database.dropDatabase()
            })
            .then(() => {
                return mongo.close()
            })
            .then(() => {
                done()
            })
    })
})
