const queryStringParser = require("../../src/routes/query-string")
require("should")

describe("QueryString.parse", function () {

    it("?skip=10 should return skip=10", function () {
        queryStringParser.parse("?skip=10").skip.should.equal(10)
    })

    it("?skip=0 should return no skip", function () {
        (queryStringParser.parse("?skip=0").skip == undefined).should.equal(true)
    })

    it("?limit=10 should return limit=10", function () {
        queryStringParser.parse("?limit=10").limit.should.equal(10)
    })

    it("?limit=0 should return no limit", function () {
        (queryStringParser.parse("?limit=0").limit == undefined).should.equal(true)
    })

    it("?paginate=true should return paginate=true", function () {
        queryStringParser.parse("?paginate=true").paginate.should.equal(true)
    })

    it("?paginate=false should return paginate=false", function () {
        queryStringParser.parse("?paginate=false").paginate.should.equal(false)
    })

    it("?total=true should return total=true", function () {
        queryStringParser.parse("?total=true").total.should.equal(true)
    })

    it("?total=false should return total=false", function () {
        queryStringParser.parse("?total=false").total.should.equal(false)
    })

    it("?total= should throw error", function () {
        (() => queryStringParser.parse("?total=")).should.throwError("bad query string")
    })

    it("?fields=name should return {name:1}", function () {
        queryStringParser.parse("?fields=name").fields.should.deepEqual({
            name: 1
        })
    })

    it("?fields=-name should return {name:1}", function () {
        queryStringParser.parse("?fields=-name").fields.should.deepEqual({
            name: 0
        })
    })

    it("?fields= should throw error", function () {
        (() => queryStringParser.parse("?fields=")).should.throwError("bad query string")
    })

    it("?sort=name should return {name:1}", function () {
        queryStringParser.parse("?sort=name").sort.should.deepEqual({
            name: 1
        })
    })

    it("?sort=-name should return {name:1}", function () {
        queryStringParser.parse("?sort=-name").sort.should.deepEqual({
            name: -1
        })
    })

    it("?sort=name,-description should return {name:1}", function () {
        queryStringParser.parse("?sort=name,-description").sort.should.deepEqual([
            ["name", 1],
            ["description", -1]
        ])
    })

    it("?sort= should throw error", function () {
        (() => queryStringParser.parse("?sort=")).should.throwError("bad query string")
    })

    it("?sort=name, should throw error", function () {
        (() => queryStringParser.parse("?sort=name,")).should.throwError("bad query string")
    })

    it("?foo=bar should return filter {foo:'bar'}", function () {
        queryStringParser.parse("?foo=bar").filter.should.deepEqual({
            foo: "bar"
        })
    })

    it("?foo=1 should return filter {foo:'1'}", function () {
        queryStringParser.parse("?foo=1").filter.should.deepEqual({
            foo: "1"
        })
    })

    it("?foo=1:number should return filter {foo:1}", function () {
        queryStringParser.parse("?foo=1:number").filter.should.deepEqual({
            foo: 1
        })
    })

    it("?foo=a:number should throw error", function () {
        (() => queryStringParser.parse("?foo=a:number")).should.throwError("bad query string")
    })

    it("?foo=true should return filter {foo:'true'}", function () {
        queryStringParser.parse("?foo=true").filter.should.deepEqual({
            foo: "true"
        })
    })

    it("?foo=true:boolean should return filter {foo:true}", function () {
        queryStringParser.parse("?foo=true:boolean").filter.should.deepEqual({
            foo: true
        })
    })

    it("?foo=false:boolean should return filter {foo:false}", function () {
        queryStringParser.parse("?foo=false:boolean").filter.should.deepEqual({
            foo: false
        })
    })

    it("?foo=a:boolean should throw error", function () {
        (() => queryStringParser.parse("?foo=a:boolean")).should.throwError("bad query string")
    })

    it("?foo=bar&the=end should return filter {$and:[{foo:'bar'},{the:'end'}]}", function () {
        queryStringParser.parse("?foo=bar&the=end").filter.should.deepEqual({
            $and: [{
                foo: "bar"
            }, {
                the: "end"
            }]
        })
    })

    it("?foo!=bar should return filter {foo:{$ne:'bar'}}", function () {
        queryStringParser.parse("?foo!=bar").filter.should.deepEqual({
            foo: {
                "$ne": "bar"
            }
        })
    })

    it("?foo!= should return filter {foo:{$exists:true}}", function () {
        queryStringParser.parse("?foo!=").filter.should.deepEqual({
            foo: {
                "$exists": true
            }
        })
    })

    it("?!=a should throw error", function () {
        (() => queryStringParser.parse("?!=a")).should.throwError("bad query string")
    })

    it("?foo= should return filter {foo:{$exists:false}}", function () {
        queryStringParser.parse("?foo=").filter.should.deepEqual({
            foo: {
                "$exists": false
            }
        })
    })

    it("?foo>bar should return filter {foo:{$gt:bar}}", function () {
        queryStringParser.parse("?foo>bar").filter.should.deepEqual({
            foo: {
                "$gt": "bar"
            }
        })
    })

    it("?>a should throw error", function () {
        (() => queryStringParser.parse("?>a")).should.throwError("bad query string")
    })

    it("?foo> should throw error", function () {
        (() => queryStringParser.parse("?foo>")).should.throwError("bad query string")
    })

    it("?foo<bar should return filter {foo:{$lt:bar}}", function () {
        queryStringParser.parse("?foo<bar").filter.should.deepEqual({
            foo: {
                "$lt": "bar"
            }
        })
    })

    it("?<a should throw error", function () {
        (() => queryStringParser.parse("?<a")).should.throwError("bad query string")
    })

    it("?foo< should throw error", function () {
        (() => queryStringParser.parse("?foo<")).should.throwError("bad query string")
    })

    it("?foo>=bar should return filter {foo:{$gte:bar}}", function () {
        queryStringParser.parse("?foo>=bar").filter.should.deepEqual({
            foo: {
                "$gte": "bar"
            }
        })
    })

    it("?>=a should throw error", function () {
        (() => queryStringParser.parse("?>=a")).should.throwError("bad query string")
    })

    it("?foo>= should throw error", function () {
        (() => queryStringParser.parse("?foo>=")).should.throwError("bad query string")
    })

    it("?foo<=bar should return filter {foo:{$lte:bar}}", function () {
        queryStringParser.parse("?foo<=bar").filter.should.deepEqual({
            foo: {
                "$lte": "bar"
            }
        })
    })

    it("?<=a should throw error", function () {
        (() => queryStringParser.parse("?<=a")).should.throwError("bad query string")
    })

    it("?foo<= should throw error", function () {
        (() => queryStringParser.parse("?foo<=")).should.throwError("bad query string")
    })

    it("?foo~=bar should return filter {foo:{$regex:'bar',$options:'i'}}", function () {
        queryStringParser.parse("?foo~=bar").filter.should.deepEqual({
            foo: {
                $regex: "bar",
                $options: "i"
            }
        })
    })

    it("?~=bar should throw error", function () {
        (() => queryStringParser.parse("?~=bar")).should.throwError("bad query string")
    })

    it("?foo~= should throw error", function () {
        (() => queryStringParser.parse("?foo~=")).should.throwError("bad query string")
    })

    it("?foo^=bar should return filter {foo:{$regex:'^bar',$options:'i'}}", function () {
        queryStringParser.parse("?foo^=bar").filter.should.deepEqual({
            foo: {
                $regex: "^bar",
                $options: "i"
            }
        })
    })

    it("?^=bar should throw error", function () {
        (() => queryStringParser.parse("?^=bar")).should.throwError("bad query string")
    })

    it("?foo^= should throw error", function () {
        (() => queryStringParser.parse("?foo^=")).should.throwError("bad query string")
    })

    it("?foo$=bar should return filter {foo:{$regex:'bar$',$options:'i'}}", function () {
        queryStringParser.parse("?foo$=bar").filter.should.deepEqual({
            foo: {
                $regex: "bar$",
                $options: "i"
            }
        })
    })

    it("?$=bar should throw error", function () {
        (() => queryStringParser.parse("?$=bar")).should.throwError("bad query string")
    })

    it("?foo$= should throw error", function () {
        (() => queryStringParser.parse("?foo$=")).should.throwError("bad query string")
    })

    it("?foo!=bar,baz should return filter {foo:{$nin:['bar','baz']}}", function () {
        queryStringParser.parse("?foo!=bar,baz").filter.should.deepEqual({
            foo: {
                $nin: ["bar", "baz"]
            }
        })
    })

    it("?foo=bar,baz should return filter {foo:{in:['bar','baz']}}", function () {
        queryStringParser.parse("?foo=bar,baz").filter.should.deepEqual({
            foo: {
                $in: ["bar", "baz"]
            }
        })
    })

    it("? should throw error", function () {
        (() => queryStringParser.parse("?")).should.throwError("bad query string")
    })

    it("?= should throw error", function () {
        (() => queryStringParser.parse("?=")).should.throwError("bad query string")
    })

    it("?>bar should throw error", function () {
        (() => queryStringParser.parse("?>bar")).should.throwError("bad query string")
    })

    it("?<bar should throw error", function () {
        (() => queryStringParser.parse("?<bar")).should.throwError("bad query string")
    })

    it("?limit= should throw error", function () {
        (() => queryStringParser.parse("?limit=")).should.throwError("bad query string")
    })

    it("?limit=a should throw error", function () {
        (() => queryStringParser.parse("?limit=a")).should.throwError("bad query string")
    })

    it("?limit=-1 should throw error", function () {
        (() => queryStringParser.parse("?limit=-1")).should.throwError("bad query string")
    })
})

describe("QueryString.fields", function () {

    it("? should throw error", function () {
        (() => queryStringParser.fields("?")).should.throwError("bad query string")
    })

    it("?fields= should throw error", function () {
        (() => queryStringParser.fields("?fields=")).should.throwError("bad query string")
    })
})
