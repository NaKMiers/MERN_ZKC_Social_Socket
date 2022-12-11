const io = require('socket.io')(3002, {
   cors: {
      origin: 'http://localhost:3000',
   },
})

let activeUsers = []

io.on('connection', socket => {
   // add new user
   socket.on('new-user-add', newUserId => {
      // if user is not added previous
      if (!activeUsers.some(user => user.userId === newUserId)) {
         activeUsers.push({
            userId: newUserId,
            socketId: socket.id,
         })
      }
      console.log('Connected Users', activeUsers)
      io.emit('get-users', activeUsers)
   })

   // socket disconnect
   socket.on('disconnect', () => {
      activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
      console.log('User disconnected', activeUsers)
      io.emit('get-users', activeUsers)
   })

   // socket send-message
   socket.on('send-message', data => {
      const { receiverId } = data
      const user = activeUsers.find(user => user.userId === receiverId)
      console.log('Sending from socket io: ', receiverId)
      console.log('Data: ', data)
      if (user) {
         io.to(user.socketId).emit('receive-message', data)
      }
   })
})
