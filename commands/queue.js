const path = require('path')
require('dotenv').config({path: path.resolve(__dirname + '../.env')})
const io = require('socket.io-client')
var socket = io.connect(process.env.SERVER_ADDRESS)

function getQueue(personName) {
    return new Promise(resolve => {
        socket.emit('course_queue', personName)
        socket.on('queue_course', response => {
            resolve(response)
        })
    })
}

module.exports = (mixerSocket, data) => {
    getQueue(data.user_name)
    .then(response => {
        jsonResponse = JSON.parse(response)
        responseMessage = `@${data.user_name}, ${jsonResponse.message}`
        mixerSocket.call('msg', [`@${data.user_name}, ${responseMessage}`])
            .then(message => {
                console.log(`Sent: `)
                console.dir(message.message)
            })
            .catch(console.error)
    })
}