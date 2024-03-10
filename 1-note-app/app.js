const validator = require('validator')
const chalk = require('chalk')
const yargs = require('yargs')


const utils = require('./utils')
const notes = require('./note-commands')



// console.log(utils.name.first, utils.name.last)
// console.log(utils.add(10, 20))
// console.log(utils.sub(10, 20))
// if (validator.isEmail('omarkhalili810.com')) {
//     console.log(chalk.green.underline.bold('true'))
// } else {
//     console.log(chalk.bgRed.bold('false'))
// }

yargs.command({
    command: "add",
    describe: "add a new note",
    builder: {
        title: {
            describe: "Note title",
            demandOption: true,
            type: "string"
        }, body: {
            describe: "Note body",
            demandOption: true,
            type: "string"
        }
    },
    handler: function () { notes.addNote(yargs.argv.title, yargs.argv.body) }
})
yargs.command({
    command: "remove",
    describe: "remove a  note",
    builder: {
        title: {
            describe: "Note title",
            demandOption: true,
            type: "string"
        }
    },
    handler: function () { notes.removeNote(yargs.argv.title) }
})
yargs.command({
    command: "read",
    describe: "read note",
    builder: {
        title: {
            describe: "Note title",
            demandOption: true,
            type: "string"
        }
    },
    handler: function () { notes.readNote(yargs.argv.title) }
})
yargs.command({
    command: "list",
    describe: "list all  notes",
    handler: function () { notes.listNotes() }
})

yargs.parse()
