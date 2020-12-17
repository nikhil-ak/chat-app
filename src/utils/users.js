const users =[]

const addUser = ({id, username, room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room) {
        return {
            error: 'username and room are required'
        }
    }

    const existingUser = users.find(user => user.room === room && user.username === username)
    if(existingUser) {
        return {
            error: 'User already exist'
        }
    }

    const user = {id,username,room}
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const toDeleteUserIndex = users.findIndex(user => user.id === id)
    if(toDeleteUserIndex ===-1) {
        return {
            error: 'No such user exist'
        }
    }
    const user = users.splice(toDeleteUserIndex,1)[0]
    return user

}

const getUser = (id) => {
    const user = users.find(user => user.id === id)
    if(!user) {
        return {
            error: 'No such user exist'
        }
    }
    return user
}

const getUsersInRoom = (room) => {
    const usersInRoom = users.filter(user => user.room === room.trim().toLowerCase())
    if(usersInRoom.length === 0) {
        return {
            error: 'No users in room'
        }
    }
    return usersInRoom
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

