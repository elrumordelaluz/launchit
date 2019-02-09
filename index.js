const chalk = require('chalk')
const openTab = require('iterm-tab')
const inquirer = require('inquirer')
const openEditor = require('./openEditor')

const launchIt = async ({ boot = [], apps } = {}) => {
  try {
    if (boot.length) {
      for (let service of boot) {
        const [command, options] = Array.isArray(service)
          ? service
          : [service, {}]

        await openTab(command, options)
      }
    }

    let dependeciesResults = []
    for (let { dependencies } of apps) {
      let result = {}
      for (let dependency of dependencies) {
        result[dependency.name] = await dependency()
      }
      dependeciesResults.push(result)
    }
    console.log({ dependeciesResults })
    const { services, editAll, editSingle } = await inquirer.prompt([
      {
        type: 'checkbox',
        message: `Which services do you want to launch`,
        name: 'services',
        choices: apps.map(
          ({ name, path, script, dependencies, defaultChecked }, index) => {
            const disabled = Object.keys(dependeciesResults[index]).reduce(
              (acc, next) => {
                const curr = dependeciesResults[index][next]
                return curr ? acc : `${acc}${next}`
              },
              ''
            )

            return {
              name,
              checked: defaultChecked,
              disabled,
            }
          }
        ),
        validate: answer => {
          console.log({ answer })
          if (answer) {
            console.log({ answer })
          }
          return true
        },
      },
    ])
    console.log(services)

    process.exit()
  } catch (err) {
    console.log(chalk.bold.red(err))
    process.exit()
  }
}

module.exports = launchIt
