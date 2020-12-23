const socket = io()

const activeRoomTemplate = document.querySelector('#active-rooms-template').innerHTML
const form = document.querySelector('#entry-form')

socket.on('activerooms', (rooms) => {
    const html = Mustache.render(activeRoomTemplate, {
        rooms
    })
    form.innerHTML = html
})