describe("OPTIONS /things/:id", function () {
    it("should return 200 on success", function () {
        return this.request.options(`/things/${this.mockData[0]._id}`)
            .expect("Allow", "HEAD, GET, PUT, POST, PATCH, DELETE")
            .expect(200)
    })
})
