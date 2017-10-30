describe("GET /things/:id", function () {
    it("should return 200 on success", function () {
        return this.request.get(`/things/${this.mockData[0]._id}`)
            .set("Accept-Encoding", "")
            .expect("Content-Type", "application/json")
            .expect(200, this.mockData[0])
    })

    it("should handle deflate accept-encoding", function () {
        return this.request.get(`/things/${this.mockData[0]._id}`)
            .set("Accept-Encoding", "deflate")
            .expect("Content-Type", "application/json")
            .expect(200, this.mockData[0])
    })

    it("should handle gzip accept-encoding", function () {
        return this.request.get(`/things/${this.mockData[0]._id}`)
            .set("Accept-Encoding", "gzip")
            .expect("Content-Type", "application/json")
            .expect(200, this.mockData[0])
    })

    it("should handle unknown accept-encoding", function () {
        return this.request.get(`/things/${this.mockData[0]._id}`)
            .set("Accept-Encoding", "unknown")
            .expect("Content-Type", "application/json")
            .expect(200, this.mockData[0])
    })

    it("should only return requested fields", function () {
        return this.request.get(`/things/${this.mockData[0]._id}?fields=name`)
            .expect("Content-Type", "application/json")
            .expect(200, {
                _id: this.mockData[0]._id,
                name: this.mockData[0].name
            })
    })

    it("should return 404 if invalid mongo id", function () {
        return this.request.get("/things/invalid")
            .expect(404)
    })

    it("should return 404 if item not found", function () {
        return this.request.get("/things/000000000000")
            .expect(404)
    })
})
