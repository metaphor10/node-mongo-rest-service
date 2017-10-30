function getValue(value) {
    if (value.endsWith(":number")) {
        let v = parseFloat(value.substr(0, value.length - 7))
        if (isNaN(v)) {
            throw new Error("bad query string")
        }
        return v
    } else if (value.endsWith(":boolean")) {
        switch (value.substr(0, value.length - 8)) {
        case "true":
            return true
        case "false":
            return false
        default:
            throw new Error("bad query string")
        }
    }
    return value
}

function parseQueryString(queryString) {
    if (!queryString) return {}
    if (queryString[0] === "?") queryString = queryString.substr(1)

    const query = {}

    const mongoAnd = []

    let parts = queryString.split("&")

    for (let i = 0, len = parts.length; i < len; i++) {
        let part = parts[i]

        let equalIndex = part.indexOf("=")
        if (equalIndex == 0) throw new Error("bad query string")

        if (equalIndex == -1) {
            let greaterThanIndex = part.indexOf(">")
            if (greaterThanIndex != -1) {
                if (greaterThanIndex == 0) throw new Error("bad query string")
                // foo>10 = { foo: { $gt: 10 }}
                let field = part.substr(0, greaterThanIndex)
                let value = part.substr(greaterThanIndex + 1)
                if (!value) throw new Error("bad query string")
                let mongoQuery = {}
                mongoQuery[field] = {
                    $gt: getValue(value)
                }
                mongoAnd.push(mongoQuery)
            } else {
                let lessThanIndex = part.indexOf("<")
                if (lessThanIndex != -1) {
                    if (lessThanIndex == 0) throw new Error("bad query string")
                    // foo<10 = { foo: { $lt: 10 }}
                    let field = part.substr(0, lessThanIndex)
                    let value = part.substr(lessThanIndex + 1)
                    if (!value) throw new Error("bad query string")
                    let mongoQuery = {}
                    mongoQuery[field] = {
                        $lt: getValue(value)
                    }
                    mongoAnd.push(mongoQuery)
                } else {
                    throw new Error("bad query string")
                }
            }
        } else {
            let beforeEqual = part[equalIndex - 1]
            switch (beforeEqual) {
            case "!":
                {
                    if (equalIndex == 1) throw new Error("bad query string")
                    let field = part.substr(0, equalIndex - 1)
                    let value = part.substr(equalIndex + 1)
                    if (!value) {
                        let mongoQuery = {}
                        mongoQuery[field] = {
                            $exists: true
                        }
                        mongoAnd.push(mongoQuery)
                    } else {
                        let valueParts = value.split(",")
                        if (valueParts.length == 1) {
                            let mongoQuery = {}
                            mongoQuery[field] = {}
                            mongoQuery[field]["$ne"] = getValue(value)
                            mongoAnd.push(mongoQuery)
                        } else {
                            let values = []
                            for (let i = 0, len = valueParts.length; i < len; i++) {
                                let subValue = valueParts[i]
                                values.push(getValue(subValue))
                            }

                            let mongoQuery = {}
                            mongoQuery[field] = {
                                $nin: values
                            }
                            mongoAnd.push(mongoQuery)
                        }
                    }
                }
                break
            case ">":
                {
                    if (equalIndex == 1) throw new Error("bad query string")
                    let field = part.substr(0, equalIndex - 1)
                    let value = part.substr(equalIndex + 1)
                    if (!value) {
                        throw new Error("bad query string")
                    } else {
                        let mongoQuery = {}
                        mongoQuery[field] = {}
                        mongoQuery[field]["$gte"] = getValue(value)
                        mongoAnd.push(mongoQuery)
                    }
                }
                break
            case "<":
                {
                    if (equalIndex == 1) throw new Error("bad query string")
                    let field = part.substr(0, equalIndex - 1)
                    let value = part.substr(equalIndex + 1)
                    if (!value) {
                        throw new Error("bad query string")
                    } else {
                        let mongoQuery = {}
                        mongoQuery[field] = {}
                        mongoQuery[field]["$lte"] = getValue(value)
                        mongoAnd.push(mongoQuery)
                    }
                }
                break
            case "~":
                {
                    if (equalIndex == 1) throw new Error("bad query string")
                    let field = part.substr(0, equalIndex - 1)
                    let value = part.substr(equalIndex + 1)
                    if (!value) throw new Error("bad query string")
                    let mongoQuery = {}
                    mongoQuery[field] = {
                        $regex: value,
                        $options: "i"
                    }
                    mongoAnd.push(mongoQuery)
                }
                break
            case "^":
                {
                    if (equalIndex == 1) throw new Error("bad query string")
                    let field = part.substr(0, equalIndex - 1)
                    let value = part.substr(equalIndex + 1)
                    if (!value) throw new Error("bad query string")
                    let mongoQuery = {}
                    mongoQuery[field] = {
                        $regex: `^${value}`,
                        $options: "i"
                    }
                    mongoAnd.push(mongoQuery)
                }
                break
            case "$":
                {
                    if (equalIndex == 1) throw new Error("bad query string")
                    let field = part.substr(0, equalIndex - 1)
                    let value = part.substr(equalIndex + 1)
                    if (!value) throw new Error("bad query string")
                    let mongoQuery = {}
                    mongoQuery[field] = {
                        $regex: `${value}$`,
                        $options: "i"
                    }
                    mongoAnd.push(mongoQuery)
                }
                break
            default:
                {
                    let field = part.substr(0, equalIndex)
                    let value = part.substr(equalIndex + 1)

                    switch (field) {
                    case "limit":
                    case "skip":
                        {
                            if (!value) throw new Error("bad query string")
                            let number = parseInt(value)
                            if (isNaN(number)) {
                                throw new Error("bad query string")
                            } else if (number < 0) {
                                throw new Error("bad query string")
                            } else if (number !== 0) {
                                query[field] = number
                            }
                        }
                        break
                    case "paginate":
                    case "total":
                        switch (value) {
                        case "true":
                            query[field] = true
                            break
                        case "false":
                            query[field] = false
                            break
                        default:
                            throw new Error("bad query string")
                        }
                        break
                    case "fields":
                        {
                            if (!value) throw new Error("bad query string")
                            let values = value.split(",")
                            let fields = {}
                            for (let i = 0, len = values.length; i < len; i++) {
                                let field = values[i]
                                if (field[i][0] === "-") {
                                    fields[field.substr(1)] = 0
                                } else {
                                    fields[field] = 1
                                }
                            }
                            query.fields = fields
                        }
                        break
                    case "sort":
                        {
                            if (!value) throw new Error("bad query string")
                            let values = value.split(",")
                            let sort = []
                            for (let i = 0, len = values.length; i < len; i++) {
                                let field = values[i]
                                if (!field) throw new Error("bad query string")
                                if (field[0] === "-") {
                                    sort.push([field.substring(1), -1])
                                } else {
                                    sort.push([field, 1])
                                }
                            }
                            if (sort.length === 1) {
                                query.sort = {}
                                query.sort[sort[0][0]] = sort[0][1]
                            } else {
                                query.sort = sort
                            }
                        }
                        break
                    default:
                        {
                            if (!value) {
                                let mongoQuery = {}
                                mongoQuery[field] = {
                                    $exists: false
                                }
                                mongoAnd.push(mongoQuery)
                            } else {
                                let valueParts = value.split(",")
                                if (valueParts.length == 1) {
                                    let mongoQuery = {}
                                    mongoQuery[field] = getValue(value)
                                    mongoAnd.push(mongoQuery)
                                } else {
                                    let values = []
                                    for (let i = 0, len = valueParts.length; i < len; i++) {
                                        let subValue = valueParts[i]
                                        values.push(getValue(subValue))
                                    }

                                    let mongoQuery = {}
                                    mongoQuery[field] = {
                                        $in: values
                                    }
                                    mongoAnd.push(mongoQuery)
                                }
                            }
                        }
                        break
                    }
                }
                break
            }
        }
    }

    if (mongoAnd.length == 1) {
        query.filter = mongoAnd[0]
    } else if (mongoAnd.length > 1) {
        query.filter = {
            $and: mongoAnd
        }
    }

    return query
}

function parseFields(queryString) {
    if (!queryString) return
    if (queryString[0] === "?") queryString = queryString.substr(1)

    if (!queryString.startsWith("fields=")) {
        throw new Error("bad query string")
    }

    let value = queryString.substr(7)
    if (!value) {
        throw new Error("bad query string")
    }

    let values = value.split(",")
    let fields = {}
    for (let i = 0, len = values.length; i < len; i++) {
        let field = values[i]
        fields[field] = 1
    }
    return fields
}

module.exports = {
    parse: parseQueryString,
    fields: parseFields
}
