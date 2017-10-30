describe("PATCH /things/:id", function () {
    it("should return 200 on success", function () {
        let clone = JSON.parse(JSON.stringify(this.mockData[0]))
        clone.name = "bob"
        return this.request.patch(`/things/${this.mockData[0]._id}`)
            .send({
                name: clone.name
            })
            .expect(200, clone)
    })

    it("should return 404 if invalid mongo id", function () {
        return this.request.patch("/things/invalid")
            .expect(404)
    })

    it("should return 404 if item not found", function () {
        return this.request.patch("/things/000000000000")
            .send({
                name: "bob"
            })
            .expect(404)
    })
})
