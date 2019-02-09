const { promisify } = require('util')
const child_process = require('child_process')
const exec = promisify(child_process.exec)

module.exports = async (path, options) => {
  return await exec(`code ${path}`, options)
}
