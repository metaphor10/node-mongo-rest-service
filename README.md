# node-mongo-rest-service

REST Service for MongoDB

## Routes

| Method | Path              | Description
| -----: | ----------------- | ---
|   POST | `/collection`     | Create a new item
|    GET | `/collection`     | Query collection items
|    GET | `/collection/:id` | Get an item
|    PUT | `/collection`     | Replace collection items
|    PUT | `/collection/:id` | Replace an item
|  PATCH | `/collection`     | Update collection items
|  PATCH | `/collection/:id` | Update an item
| DELETE | `/collection`     | Delete collection items
| DELETE | `/collection/:id` | Delete an item

## Route Query String Support

| Method | Path              | Query String
| -----: | ----------------- | ---
|   POST | `/collection`     |
|    GET | `/collection`     | filter, sort, limit, skip, fields
|    GET | `/collection/:id` | fields
|    PUT | `/collection`     | filter
|    PUT | `/collection/:id` |
|  PATCH | `/collection`     | filter
|  PATCH | `/collection/:id` |
| DELETE | `/collection`     | filter
| DELETE | `/collection/:id` |

## Query String Filtering

|                Operation | Query String    | Mongo Query
| -----------------------: | --------------- | -----------
|                   equals | `?foo=bar`      | {foo:"bar"}
|           does not equal | `?foo!=bar`     | {foo:{$ne:"bar"}}
|                   exists | `?foo!=`        | {foo:{$exists:true}}
|           does not exist | `?foo=`         | {foo:{$exists:false}}
|             greater than | `?foo>10`       | {foo:{$gt:10}}
|                less than | `?foo<10`       | {foo:{$lt:10}}
| greater than or equal to | `?foo>=10`      | {foo:{$gte:10}}
|    less than or equal to | `?foo<=10`      | {foo:{$lte:10}}
|                 contains | `?foo~=bar`     | {foo:{$regex:"bar",$options:"i"}}
|              starts with | `?foo^=bar`     | {foo:{$regex:"^bar",$options:"i"}}
|                ends with | `?foo$=bar`     | {foo:{$regex:"bar$",$options:"i"}}
|                 in array | `?foo=bar,baz`  | {foo:{$in:['bar','baz']}}
|             not in array | `?foo!=bar,baz` | {foo:{$nin:['bar','baz']}}

## Filter Value Formatters

|  Format | Example Query String
| ------: | ---
|  number | `?foo=1:number`
| boolean | `?foo=true:boolean`

## Query String Options

|   Option | Description
| -------: | ---
|    limit | Limit the number of items returned
|     skip | Skip the given number of items
|   fields | Return only specified fields

## NPM Commands

|  Command | Description
| ------: | ---
| `npm install` | Install dependencies
| `npm start` | Start the service
| `npm test` | Run tests
| `npm run watch` | Start the service in debug mode

## Environment Variables

|  Command | Description
| ------: | ---
| `MONGO_CONNECTION_STRING` | The connection string for MongoDB
| `PORT` | Port to run the service on
| `LOGGER_ENABLED` | Turn on basic logging - not for production use

``` bash
MONGO_CONNECTION_STRING="mongodb://localhost:27017/database" PORT=8080 LOGGER_ENABLED=true npm start
```
