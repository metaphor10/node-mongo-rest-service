describe("OPTIONS /things", function () {
    it("should return 200 on success", function () {
        return this.request.options("/things")
            .expect("Allow", "HEAD, GET, PUT, PATCH, DELETE")
            .expect(200, "")
    })
})
