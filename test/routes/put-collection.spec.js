describe("PUT /things", function () {
    it("should return 200 on success", function () {
        return this.request.put("/things")
            .send([{
                name: "thing 1"
            }])
            .expect(200, "")
    })

    it("should return 400 if invalid body", function () {
        return this.request.put("/things")
            .send({
                name: "thing 1"
            })
            .expect(400)
    })

    it("should return 500 if body is not json", function () {
        return this.request.put("/things")
            .expect(500)
    })

    it("should return 400 if invalid query string", function () {
        return this.request.put("/things?=")
            .send({
                name: "thing 1"
            })
            .expect(400, {})
    })
})
