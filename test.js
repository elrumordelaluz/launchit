const launchit = require('.')
const { MongoClient } = require('mongodb')

const boot = [['mongod --dbpath /data/db4', { close: 5 }]]

const checkMongo = async () => {
  try {
    const client = await MongoClient.connect('mongodb://localhost:27017', {
      useNewUrlParser: true,
    })
    client.close()
    return true
  } catch (err) {
    return false
  }
}

const apps = {
  app1: {
    path: './test/app1',
    script: 'yarn stats',
    dependencies: [checkMongo],
  },
  app2: {
    path: './test/app2',
    script: 'yarn build',
    defaultChecked: true,
  },
}

launchit({ boot, apps })
