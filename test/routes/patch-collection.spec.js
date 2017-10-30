describe("PATCH /things", function () {
    it("should return 200 on success", function () {
        return this.request.patch("/things")
            .send({
                name: "thing 1"
            })
            .expect(200)
    })

    it("should patch on filtered items", function () {
        return this.request.patch("/things?group=one")
            .send({
                name: "bob"
            })
            .expect(200)
    })

    it("should return 500 if body is not json", function () {
        return this.request.patch("/things")
            .expect(500)
    })

    it("should return 400 if invalid query string", function () {
        return this.request.patch("/things?=")
            .send({
                name: "thing 1"
            })
            .expect(400, {})
    })
})
