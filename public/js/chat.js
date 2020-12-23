const socket = io()

const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})
console.log(username);

socket.emit('join', {username, room}, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})


// elements
const messageForm = document.getElementById("form")
const inputTxt = messageForm.querySelector('input')
const sendMsgBtn = messageForm.querySelector('button')
const sendLocationBtn = document.getElementById("send-location")
const messages = document.querySelector('#messages')
const sidebar = document.querySelector('#sidebar')

// template
const msgTemplate = document.querySelector("#message-template").innerHTML
const locationTemplate = document.querySelector("#location-template").innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

const autoscroll = () => {
    const newMessage = messages.lastElementChild
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
   
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin
   

    // visible height
    const visibleHeight = messages.offsetHeight
    
    // container full height
    const containerHeight = messages.scrollHeight
   

    // how far scrolled
    const scrollOffset = messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        messages.scrollTop = messages.scrollHeight
    }
}
socket.on('message', (msg) => {
    const html = Mustache.render(msgTemplate, {
        username: msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format('h:m a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


messageForm.addEventListener("submit", (e)=> {
    e.preventDefault()
    sendMsgBtn.setAttribute('disabled','disabled')
    console.log("submit clicked");
    const message = e.target.elements.message.value
    socket.emit("sendMessage", message, (error) => {
        sendMsgBtn.removeAttribute('disabled')
        inputTxt.value = ''
        inputTxt.focus()
        if(error) {
            return console.log(error);
        }
        console.log("message delivered successfully");
    })
})

sendLocationBtn.addEventListener("click", () => {
    sendLocationBtn.setAttribute('disabled','disabled')
    if(!navigator.geolocation) {
        return alert("Geolocation not supported by browser")
    }
    navigator.geolocation.getCurrentPosition((position) => {
        
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            sendLocationBtn.removeAttribute('disabled')
            console.log("Location shared");
        })
    })
   
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    sidebar.innerHTML = html
})


socket.on('locationMessage', (obj) => {
    const html = Mustache.render(locationTemplate, {
        username: obj.username,
        url: obj.url,
        createdAt: moment(obj.createdAt).format('h:m a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


