describe("PUT /things/:id", function () {
    it("should return 200 on success", function () {
        return this.request.put(`/things/${this.mockData[0]._id}`)
            .send(this.mockData[0])
            .expect(200, "")
    })

    it("should return 404 if invalid mongo id", function () {
        return this.request.put("/things/invalid")
            .send(this.mockData[0])
            .expect(404)
    })

    it("should return 404 if item not found", function () {
        return this.request.put("/things/000000000000")
            .send(this.mockData[0])
            .expect(404)
    })
})
