const path = require('path')
require('dotenv').config({path: path.resolve(__dirname + '../.env')})
const io = require('socket.io-client')
var socket = io.connect(process.env.SERVER_ADDRESS)

function getPlaying(){
    return new Promise(resolve => {
        socket.emit('currently_playing')
        socket.on('playing_currently', response => {
            resolve(response)
        })
    })
}

module.exports = (mixerSocket, data) => {
    getPlaying()
    .then(courseData => {
        course = JSON.parse(courseData)
        responseMessage = `@${data.user_name}, ${course.message}`
        mixerSocket.call('msg', [responseMessage])
            .then(message => {
                console.log(`Sent: `)
                console.dir(message.message)
            })
            .catch(console.error)
    })
}