describe("GET /", function () {
    it("should return 200 on success", function () {
        return this.request.get("/")
            .expect(200, ["things"])
    })
})
