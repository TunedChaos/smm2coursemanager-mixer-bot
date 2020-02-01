const path = require('path')
require('dotenv').config({path: path.resolve(__dirname + '../.env')})

module.exports = (socket, data) => {
    if(typeof process.env.LIST_ADDRESS != "undefined"){
        if(process.env.LIST_ADDRESS !== "")
        {
            socket.call('msg', [`@${data.user_name}, to view the current list of levels, and their statuses, please visit ${process.env.LIST_ADDRESS}`])
            .then(message => {
                console.log(`Sent: `)
                console.dir(message.message)
            })
            .catch(console.error)
        }else{
            socket.call('msg', [`@${data.user_name}, there is currently no list available.`])
            .then(message => {
                console.log(`Sent: `)
                console.dir(message.message)
            })
            .catch(console.error)
        }
    }else{
        socket.call('msg', [`@${data.user_name}, there is currently no list available.`])
            .then(message => {
                console.log(`Sent: `)
                console.dir(message.message)
            })
            .catch(console.error)
    }
}