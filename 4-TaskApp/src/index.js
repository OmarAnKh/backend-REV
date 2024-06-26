import express from 'express'
import "./DB/mongoose.js"
import userRouter from "./routers/user.js"
import taskRouter from "./routers/task.js"

const app = express()

const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('run on port ' + port)
})
