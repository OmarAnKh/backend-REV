import express from "express"
import Task from "../models/task.js"
import auth from "../middleware/auth.js"

const router = new express.Router()

// adding task
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }

})


// fetching all tasks
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        // const tasks = await Task.find({ owner: req.user._id })
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.status(200).send(req.user.tasks)
    } catch (error) {
        res.status(404).send(error)
    }

})


// fetching a specific task
router.get('/tasks/:id', auth, async (req, res) => {

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            res.status(404).send({ error: "there is no task with this id" })
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(404).send(error)
    }

})

// update a Task
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ["completed", "description"]
    const isValidOPeration = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidOPeration) {
        return res.status(400).send({ error: "Invalid update!" })
    }
    try {
        const task = await Task.findById(req.params.id);
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        task.save()

        if (!task) {
            return res.status(400).send({ error: "there is no task with this id" })
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(404).send(error)
    }
})


// delete a tsak
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send({ error: "there is no task with this id" })
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }

})


export default router