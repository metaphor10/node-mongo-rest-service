describe("GET /things", function () {
    it("should return 200 on success", function () {
        return this.request.get("/things")
            .set("Accept-Encoding", "")
            .expect("Content-Type", "application/json")
            .expect(200, this.mockData)
    })

    it("should handle deflate accept-encoding", function () {
        return this.request.get("/things")
            .set("Accept-Encoding", "deflate")
            .expect("Content-Type", "application/json")
            .expect(200, this.mockData)
    })

    it("should handle gzip accept-encoding", function () {
        return this.request.get("/things")
            .set("Accept-Encoding", "gzip")
            .expect("Content-Type", "application/json")
            .expect(200, this.mockData)
    })

    it("should handle unknown accept-encoding", function () {
        return this.request.get("/things")
            .set("Accept-Encoding", "unknown")
            .expect("Content-Type", "application/json")
            .expect(200, this.mockData)
    })

    it("should only return items matching filter", function () {
        return this.request.get("/things?group=one")
            .expect(200, this.mockData.filter((item) => {
                return item.group == "one"
            }))
    })

    it("should handle skip", function () {
        return this.request.get("/things?skip=1")
            .expect(200, this.mockData.slice(1))
    })

    it("should handle limit", function () {
        return this.request.get("/things?limit=1")
            .expect(200, [this.mockData[0]])
    })

    it("should handle fields", function () {
        return this.request.get("/things?fields=name")
            .expect(200, this.mockData.map((item) => {
                return {
                    _id: item._id,
                    name: item.name
                }
            }))
    })

    it("should handle sort ascending", function () {
        return this.request.get("/things?sort=name")
            .expect(200, this.mockData.sort())
    })

    it("should handle sort decending", function () {
        return this.request.get("/things?sort=-name")
            .expect(200, this.mockData.sort().reverse())
    })

    it("should return 400 if invalid query string", function () {
        return this.request.get("/things?=")
            .expect(400, {})
    })
})
