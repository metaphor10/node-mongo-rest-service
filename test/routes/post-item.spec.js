describe("POST /things/:id", function () {
    it("should return 405 - Method Not Allowed", function () {
        return this.request.post(`/things/${this.mockData[0]._id}`)
            .expect("Allow", "HEAD, GET, PUT, POST, PATCH, DELETE")
            .expect(405)
    })
})
