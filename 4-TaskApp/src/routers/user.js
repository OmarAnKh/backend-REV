import express from "express"
import User from "../models/user.js"
import auth from "../middleware/auth.js"
import sharp from "sharp"
const router = new express.Router()
import multer from "multer"
import sendEmail from "../emails/account.js"

const upload = multer({
    // dest: "avatars",
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpeg|png|jpg)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

// adding a new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendEmail(user.email, user.name, "this is a welcome email to")
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
        sendEmail(user.email, user.name, "this is a farewell email to")
        if (!user) {
            return res.status(404).send({ error: "there is no user with this id" })
        }

        // await req.user.remove()
        res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }

})



router.post('/users/me/upload', auth, upload.single('avatars'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer

    await req.user.save()
    res.status(200).send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


router.delete('/users/me/upload', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set("Content-Type", "image/jpg");
        res.status(200).send(user.avatar)
    } catch (e) {
        res.status(400).send(e)
    }
})

export default router