describe("HEAD /things", function () {
    it("should return 200 on success", function () {
        return this.request.head("/head")
            .expect("Content-Type", "application/json")
            .expect(200, {})
    })
})
