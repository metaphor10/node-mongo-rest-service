describe("POST /things", function () {
    it("should return 200 on success", function () {
        return this.request.post("/things")
            .send({
                name: "thing 1"
            })
            .expect("Content-Type", "application/json")
            .expect(200)
    })

    it("should return 500 if body is not json", function () {
        return this.request.post("/things")
            .expect(500)
    })
})
