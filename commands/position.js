const path = require('path')
require('dotenv').config({path: path.resolve(__dirname + '../.env')})
const io = require('socket.io-client')
var socket = io.connect(process.env.SERVER_ADDRESS)
var commandPrefix = process.env.COMMAND_PREFIX

function getPosition(personName, courseCode) {
    return new Promise(resolve => {
        socket.emit('course_position', `${commandPrefix}position` , personName, courseCode)
        socket.on('position_course', response => {
            resolve(response)
        })
    })
}

module.exports = (mixerSocket, data, msg) => {
    var personName = data.user_name
    var courseCode = msg.substr(msg.indexOf(`${commandPrefix}position`) + 10, 11)
    getPosition(personName,courseCode)
    .then(response => {
        jsonResponse = JSON.parse(response)
        responseMessage = `@${personName}, ${jsonResponse.message}`
        mixerSocket.call('msg', [responseMessage])
            .then(message => {
                console.log(`Sent: `)
                console.dir(message.message)
            })
            .catch(console.error)
    })
}