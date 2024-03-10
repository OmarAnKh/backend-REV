const chalk = require('chalk')
const fs = require("fs")
const loadNotes = function () {
    try {
        const dataBuffer = fs.readFileSync('notes.json')
        const dataJson = dataBuffer.toString()
        return JSON.parse(dataJson)
    } catch (e) {
        return []
    }

}
const saveNotes = function (notes) {
    try {
        const dataJson = JSON.stringify(notes)
        fs.writeFileSync('notes.json', dataJson)
    } catch (e) {

    }

}
const addNote = function (title, body) {
    const notes = loadNotes()
    const duplicateNotes = notes.filter(function (note) {
        if (note.title === title) {
            return true
        }
        return false
    })
    if (duplicateNotes.length === 0) {
        notes.push({
            title: title,
            body: body
        })
        saveNotes(notes)
    }
    else {
        console.log(
            chalk.green.underline.bold('title exist ')
        )
    }

}
const removeNote = function (title) {
    const notes = loadNotes()
    const newNotes = notes.filter(function (note) {
        return note.title !== title
    })
    if (newNotes.length === notes.length) {

        chalk.bgRed.bold("there is no note with this title")
    }
    else {
        saveNotes(newNotes)
    }

}
const readNote = function (title) {
    const notes = loadNotes()
    notes.map(function (note) {
        if (note.title === title) {
            console.log(chalk.green.underline.bold("the title is: "), note.title, chalk.green.underline.bold(" and the body is: "), note.body)
        }
    })
}
const listNotes = function () {
    const notes = loadNotes()
    notes.map(function (note) {
        console.log(chalk.green.underline.bold("the title is: "), note.title, chalk.green.underline.bold(" and the body is: "), note.body)
    })
}
module.exports = {
    readNote: readNote,
    addNote: addNote,
    removeNote: removeNote,
    listNotes: listNotes
};