import express from "express"
import User from "../models/user.js"
import auth from "../middleware/auth.js"
const router = new express.Router()
import multer from "multer"
const upload = multer({
    dest: 'avatars'
})
// adding a new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }

})


router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(400).send()
    }
})



router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }

})

router.post('/users/logoutALL', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }

})
// fetching all users
router.get('/users', async (req, res) => {

    try {
        const users = await User.find({})
        res.status(201).send(users)
    } catch (error) {
        res.status(500).send()
    }

})
router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)

})


//fetching a specific user 
// router.get('/users/:id', async (req, res) => {

//     try {
//         const user = await User.find({ _id: req.params.id })
//         if (!user) {
//             res.status(404).send(error)
//         }
//         res.status(201).send(user)
//     } catch (error) {
//         res.status(404).send(error)
//     }

// })



// update user info
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name', 'email', 'password', 'age']
    const isValidOPeration = updates.every((update) => {
        return allowedUpdate.includes(update)
    })
    if (!isValidOPeration) {
        return res.status(400).send({ error: "Invalid update!" })
    }
    try {
        const user = await User.findById(req.user._id)

        updates.forEach((update) => {
            user[update] = req.body[update]
        })

        await user.save()

        if (!user) {
            return res.status(404).send({ error: "there is no user with this id" })
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})


// delete a user

router.delete('/users/me', auth, async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.user._id)
        if (!user) {
            return res.status(404).send({ error: "there is no user with this id" })
        }

        // await req.user.remove()
        res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }

})



router.post('/users/me/upload', upload.single('avatars'), (req, res) => {
    res.status(200).send()
})

export default router