# node-mongo-rest-service [![Build Status](https://travis-ci.org/jamestalton/node-mongo-rest-service.svg?branch=master)](https://travis-ci.org/jamestalton/node-mongo-rest-service)

REST Service for MongoDB

The goal of this project is to provide a robust REST API for a Mongo database.

**WARNING**: Alpha - Work in progress. The API may change going forward in subtle ways until we declare a stable release.

## Docker

A Docker image of this project is available as [jtalton/node-mongo-rest-service](https://hub.docker.com/r/jtalton/node-mongo-rest-service/).

If you have [Docker](https://www.docker.com) setup, you can start a Mongo container and then a Mongo-Rest container linking it to Mongo.

Once setup, http://localhost:3000/things?limit=1 should return an array "things" from the MongoDB collection "things".

### Mongo

``` bash
docker run --name mongo -p 27017:27017 -v /somewhere/onmyhost/mydatabase:/data/db -d --restart always mvertes/alpine-mongo
```

### Mongo Rest

``` bash
docker run --name mongo-rest -p 3000:3000 --link mongo:mongo -e MONGO_CONNECTION_STRING="mongodb://mongo:27017/database" -d --restart always jtalton/node-mongo-rest-service
```

## Routes

| Method | Path              | Description              | Query String Support
| -----: | ----------------- | ------------------------ | ---
|   POST | `/collection`     | Create a new item        |
|    GET | `/collection`     | Query collection items   | `filter, sort, limit, skip, fields`
|    GET | `/collection/:id` | Get an item              | `fields`
|    PUT | `/collection`     | Replace collection items | `filter`
|    PUT | `/collection/:id` | Replace an item          |
|  PATCH | `/collection`     | Update collection items  | `filter`
|  PATCH | `/collection/:id` | Update an item           |
| DELETE | `/collection`     | Delete collection items  | `filter`
| DELETE | `/collection/:id` | Delete an item           |

## Query String Filtering

|                Operation | Query String      | Mongo Query
| -----------------------: | ----------------- | -----------
|                   equals | `?foo=bar`        | { foo: "bar" }
|           does not equal | `?foo!=bar`       | { foo: { $ne: "bar" } }
|                   exists | `?foo!=`          | { foo: { $exists: true } }
|           does not exist | `?foo=`           | { foo: { $exists: false } }
|             greater than | `?foo>10:number`  | { foo: { $gt: 10 } }
|                less than | `?foo<10:number`  | { foo: { $lt: 10 } }
| greater than or equal to | `?foo>=10:number` | { foo: { $gte: 10 } }
|    less than or equal to | `?foo<=10:number` | { foo: { $lte: 10 } }
|                 contains | `?foo~=bar`       | { foo: { $regex: "bar", $options:"i" } }
|              starts with | `?foo^=bar`       | { foo: { $regex: "^bar", $options:"i" } }
|                ends with | `?foo$=bar`       | { foo: { $regex: "bar$", $options:"i" } }
|                 in array | `?foo=bar,baz`    | { foo: { $in: ['bar', 'baz'] } }
|             not in array | `?foo!=bar,baz`   | { foo: { $nin: ['bar', 'baz'] } }

## Filter Value Formatters

|  Format | Example Query String
| ------: | ---
|  number | `?foo=1:number`
| boolean | `?foo=true:boolean`

## Query String Options

|   Option | Description | Example
| -------: | --- | ---
|    `limit` | Limit the number of items returned | `?limit=10`
|     `skip` | Skip the given number of items | `?skip=10`
|     `sort` | Sort the items returned | `?sort=name,-description,age`
|   `fields` | Return only specified fields | `?fields=name,description`

## Development

node-mongo-rest-server is written in JavaScript and run using [NodeJS](https://nodejs.org).

### Running locally

1. Make sure you have NodeJS installed.
1. Have Mongo running and know your MONGO_CONNECTION_STRING.
1. Clone the repository.
1. Install dependencies.
1. Start the service passing in MONGO_CONNECTION_STRING and optionally PORT.

``` bash
MONGO_CONNECTION_STRING="mongodb://localhost:27017/database" PORT=3000 LOGGER_ENABLED=true npm start
```

### NPM Commands

|  Command | Description
| ------: | ---
| `npm install` | Install dependencies
| `npm start` | Start the service
| `npm test` | Run tests
| `npm run watch` | Start the service in debug mode

### Environment Variables

|  Command | Description
| ------: | ---
| `MONGO_CONNECTION_STRING` | The connection string for MongoDB
| `PORT` | Port to run the service on
| `LOGGER_ENABLED` | Turn on basic logging - not for production use - yet...
