import mongoose from 'mongoose'
import validator from 'validator'

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task',taskSchema)





export default Task