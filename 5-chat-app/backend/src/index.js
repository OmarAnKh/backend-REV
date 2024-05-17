import express from 'express';
import http from 'http';
import { Server } from 'socket.io'
import cors from "cors"
import Filter from "bad-words"
import { generateMessage, generateLocationMessage } from "./utils/messages.js"
import { addUser, getAllUsersInARoom, getUser, removeUser } from './utils/users.js';
const app = express();

app.use(express.json());
app.use(cors())

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:3000" },
});



const port = process.env.PORT | 5000;
let count = 0
app.get('/', (req, res) => {
    res.send('<h1> Chat APP </h1>');
});

io.on("connection", (socket) => {
    console.log("New connection")



    // socket.emit('message', generateMessage("welcome"))


    // socket.broadcast.emit('message', generateMessage("a new user has joind"))
    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id)

        if (!user) {
            return callback("there is no user")
        }

        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('this message is is Profane')
        }
        console.log(user)
        io.to(user.room).emit("message", generateMessage(user.username, message))
        callback()
    })



    socket.on('join', ({ username, room }, callback) => {

        const { error, user } = addUser({ id: socket.id, username, room })
        if (error) {
            return callback(error)
        }
        socket.join(room)
        socket.emit("message", generateMessage("system", "Welcome " + username))
        socket.broadcast.to(room).emit("message", generateMessage("system", `${username} has joined`))
        io.to(room).emit("roomData", { room, users: getAllUsersInARoom(room) })
        callback()
    })



    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit("message", generateMessage(`${user.username} has disconnected`))
            io.to(user.room).emit("roomData", { room: user.username, users: getAllUsersInARoom(user.room) })
        }

    })


    socket.on("getLocation", (coords, callback) => {
        const user = getUser(socket.id)
        if (!user) {
            return callback("there is no user")
        }
        if (!coords) {
            return callback("no coords was provided")
        }
        io.to(user.room).emit("locationMessage", generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        return callback()
    })

})


server.listen(port, () => {
    console.log(`run on port ${port}`);
});