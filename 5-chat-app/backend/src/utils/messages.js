const generateMessage = (username, text) => {
    return {
        text,
        createdAt: new Date().getTime(),
        username
    }
}
const generateLocationMessage = (username, URL) => {
    return {
        URL,
        createdAt: new Date().getTime(),
        username
    }
}


export {
    generateMessage,
    generateLocationMessage
}