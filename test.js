const launchit = require('.')
const { MongoClient } = require('mongodb')

const boot = [
  ['echo "hola"', { close: true }],
  // 'echo "ciao"',
  // 'echo "third"',
  // ['echo "last"', { delayAfterRun: 15 }],
]

const checkMongo = async () => {
  let client
  try {
    client = await MongoClient.connect('mongodb://localhost:27017', {
      useNewUrlParser: true,
    })
    return true
  } catch (err) {
    throw 'No MongoDb Connection'
  }
  client.close()
}

const checkFalse = async () => {
  return await false
}
const anotherCheckFalse = async () => {
  return await false
}

const apps = [
  {
    name: 'my-site',
    path: '/Users/lio/Projects/elrumordelaluz',
    script: 'yarn develop',
    dependencies: [checkMongo],
    defaultChecked: true,
  },
  {
    name: 'another-site',
    path: '/Users/lio/Projects/elrumordelaluz',
    script: 'yarn develop',
    dependencies: [checkFalse, anotherCheckFalse],
  },
]

launchit({ boot, apps })
