const users = []

const addUser = ({ id, username, room }) => {

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: "User name And rome are required!"
        }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })


    if (existingUser) {
        return {
            error: "User name Must be unique"
        }
    }

    const user = { id, username, room }
    users.push(user)
    return {
        user
    }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
    return { error: "couldn't find the user" }

}


const getUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users[index]
    }
    return { error: "couldn't find the user" }
}

const getAllUsersInARoom = (room) => {

    if (!room) {
        return {
            error: "User name And rome are required!"
        }
    }
    room = room.trim().toLowerCase()
    const roomUsers = users.filter((user) => {
        return user.room === room
    })
    return roomUsers
}


export {
    addUser,
    removeUser,
    getUser,
    getAllUsersInARoom
}