const testMongo = require("../test-mongo")

describe("DELETE /things", function () {
    it("should return 200 on success", function () {
        return this.request.delete("/things")
            .expect(200, {})
            .then(function () {
                return testMongo.collectionShouldEqual("things", [])
            })
    })

    it("should only delete items matching filter", function () {
        let context = this
        return context.request.delete("/things?group=one")
            .expect(200, {})
            .then(function () {
                return testMongo.collectionShouldEqual("things", context.mockData.filter((item) => {
                    return item.group != "one"
                }))
            })
    })

    it("should return 400 if invalid query string", function () {
        return this.request.delete("/things?=")
            .expect(400, {})
    })
})
