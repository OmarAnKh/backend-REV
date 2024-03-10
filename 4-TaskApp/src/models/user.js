import bcrypt from "bcryptjs"
import mongoose from 'mongoose'
import validator from 'validator'
import jwt from "jsonwebtoken"
import Task from "./task.js"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('email must be a provided and an actual email')
            }
        },
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        require: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error('password cant have password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }],
},
    {
        timestamps: true
    })


userSchema.pre('save', async function (next) {

    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismytoken')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token

}

// userSchema.methods.getPublicProfile = function () {
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens


//     return userObject
// }

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens


    return userObject
}

userSchema.pre('remove', async function (next) {
    const user = this
    Task.deleteMany({ owner: user._id })
    next()
})
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


const User = mongoose.model('User', userSchema)

export default User