describe("HEAD /things/:id", function () {
    it("should return 200 on success", function () {
        return this.request.head(`/things/${this.mockData[0]._id}`)
            .expect("Content-Type", "application/json")
            .expect(200, {})
    })

    it("should return 404 if item not found", function () {
        return this.request.head("/things/invalid")
            .expect(404)
    })
})
