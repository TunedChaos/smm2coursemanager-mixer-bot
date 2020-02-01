const fs = require('fs')
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname+'/.env')})
const Mixer = require('@mixer/client-node')
const ws = require('ws')

let userInfo

const mixerClient = new Mixer.Client(new Mixer.DefaultRequestRunner());

// With OAuth we don't need to log in. The OAuth Provider will attach
// the required information to all of our requests after this call.
mixerClient.use(new Mixer.OAuthProvider(mixerClient, {
    tokens: {
        access: process.env.MIXER_ACCESS_TOKEN,
        expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
    },
}));

// Gets the user that the Access Token we provided above belongs to.
mixerClient.request('GET', 'users/current')
.then(response => {
    //console.log(response.body);

    // Store the logged in user's details for later reference
    userInfo = response.body;

    // Returns a promise that resolves with our chat connection details.
    return new Mixer.ChatService(mixerClient).join(response.body.channel.id);
})
.then(response => {
    const body = response.body;
    //console.log(body);
    return createChatSocket(userInfo.id, userInfo.channel.id, body.endpoints, body.authkey)
})
.catch(error => {
    console.error('Something went wrong.');
    console.error(error);
})

/**
 * Creates a Mixer chat socket and sets up listeners to various chat events.
 * @param {number} userId The user to authenticate as
 * @param {number} channelId The channel id to join
 * @param {string[]} endpoints An array of endpoints to connect to
 * @param {string} authkey An authentication key to connect with
 * @returns {Promise.<>}
 */
function createChatSocket (userId, channelId, endpoints, authkey) {
    // Chat connection
    const socket = new Mixer.Socket(ws, endpoints).boot();

    fs.readdir('./events/', (err, files) => {
        files.forEach(file => {
            const eventHandler = require(`./events/${file}`)
            const eventName = file.split('.')[0]
            socket.on(eventName, (...args) => eventHandler(socket, userId, ...args))
        })
    })

    // Handle errors
    socket.on('error', error => {
        console.error('Socket error');
        console.error(error);
    });

    return socket.auth(channelId, userId, authkey)
    .then(() => {
        console.log('Login successful');
    });
}

