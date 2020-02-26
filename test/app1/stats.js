const { MongoClient } = require('mongodb')
const test = require('assert')

MongoClient.connect(
  'mongodb://localhost:27017',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    const db = client.db('test')
    db.stats().then(stats => {
      test.ok(stats != null)
      console.log({ stats })
      client.close()
    })
  }
)
