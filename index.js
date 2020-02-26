const openTab = require('iterm-tab')
const inquirer = require('inquirer')
const openEditor = require('./openEditor')

const launchIt = async ({ boot = [], apps, skipEditor = false } = {}) => {
  try {
    if (boot.length) {
      for (let service of boot) {
        const [command, options] = Array.isArray(service)
          ? service
          : [service, {}]

        await openTab(command, options)
      }
    }

    let dependeciesResults = {}
    const appsKeys = Object.keys(apps)

    for (let app of appsKeys) {
      if (apps[app].dependencies) {
        const { dependencies } = apps[app]
        let result = {}
        for (let dependency of dependencies) {
          result[dependency.name] = await dependency()
        }
        dependeciesResults[app] = result
      }
    }

    const { services, editAll, editSingle } = await inquirer.prompt([
      {
        type: 'checkbox',
        message: `Which services do you want to launch`,
        name: 'services',
        choices: appsKeys.map((app, index) => {
          const { defaultChecked } = apps[app]
          // const dependenciesArray = Object.keys(dependeciesResults[index])
          const disabled = dependeciesResults[app]
            ? Object.keys(dependeciesResults[app]).reduce(
                (acc, next, _index) => {
                  const isLast =
                    _index === Object.keys(dependeciesResults[app]).length - 1
                  const curr = dependeciesResults[app][next]
                  return curr
                    ? acc
                    : `${isLast ? 'dependecies not active: ' : ''}${acc}${
                        acc !== '' ? ', ' : ''
                      }${next}`
                },
                ''
              )
            : false

          return {
            name: app,
            checked: defaultChecked,
            disabled,
          }
        }),
      },
      {
        type: 'confirm',
        message: `Do you want to open all services in Code Editor?`,
        name: 'editAll',
        default: false,
        when: answers => {
          return answers.services.length && !skipEditor
        },
      },
      {
        type: 'checkbox',
        message: 'Which services to open in Editor',
        name: 'editSingle',
        choices: answers => answers.services.map(s => s),
        when: answers => {
          return answers.services.length && !answers.editAll && !skipEditor
        },
      },
    ])

    if (services.length > 0) {
      for (let service of services) {
        const { path, script, waitBefore } = apps[service]
        if (waitBefore && typeof waitBefore === 'number') {
          await timeout(waitBefore)
        }
        await openTab(`cd ${path} && ${script}`)
        if (
          !skipEditor &&
          (editAll || (!editAll && editSingle.includes(service)))
        ) {
          await openEditor(path)
          console.log(`> Service ${service} opened in VS Code`)
        }
      }
      process.exit()
    } else {
      throw 'Bye Bye!'
    }
  } catch (err) {
    console.log(err)
    process.exit()
  }
}

const timeout = ms => new Promise(res => setTimeout(res, ms))

module.exports = launchIt
