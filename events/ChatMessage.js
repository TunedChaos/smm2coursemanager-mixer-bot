const add = require ('../commands/add')
const list = require ('../commands/list')
const next = require ('../commands/next')
const playing = require ('../commands/playing')
const position = require('../commands/position')
const queue = require('../commands/queue')
const status = require ('../commands/status')

module.exports = (socket, userId) => {
    var commandPrefix = process.env.COMMAND_PREFIX

    // React to our !pong command
    socket.on('ChatMessage', data => {
        // Don't need to handle ourselves.
        if(userId !== data.user_id)
        {
            var messageContent = data.message.message[0].data.toLowerCase()
            if (messageContent.startsWith(`${commandPrefix}add`))
            {
                return add(socket, data, messageContent)
            }
            else if(messageContent.startsWith(`${commandPrefix}list`))
            {
                return list(socket, data)
            }
            else if(messageContent.startsWith(`${commandPrefix}next`))
            {
                return next(socket, data)
            }
            else if(messageContent.startsWith(`${commandPrefix}playing`))
            {
                return playing(socket, data)
            }
            else if(messageContent.startsWith(`${commandPrefix}position`))
            {
                return position(socket, data, messageContent)
            }
            else if(messageContent.startsWith(`${commandPrefix}queue`))
            {
                return queue(socket, data)
            }
            else if(messageContent.startsWith(`${commandPrefix}status`))
            {
                return status(socket, data, messageContent)
            }
        }
    })
}
