const testMongo = require("../test-mongo")

describe("DELETE /things/:id", function () {
    it("should return 200 on success", function () {
        let context = this
        return this.request.delete(`/things/${this.mockData[0]._id}`)
            .expect(200)
            .then(function () {
                return testMongo.collectionShouldEqual("things", context.mockData.slice(1))
            })
    })

    it("should return 404 if invalid mongo id", function () {
        return this.request.delete("/things/invalid")
            .expect(404)
    })

    it("should return 404 if item not found", function () {
        return this.request.delete("/things/000000000000")
            .expect(404)
    })
})
