var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log("Server is running...");


//create a route
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//open a connections
io.sockets.on('connection', function(socket){
  connections.push(socket); //add connection to array
  console.log("Connected: %s sockets connected", connections.length);

  //when someone disconnects, tell how many users still connected
  socket.on('disconnect', function(){
    //remove username when user disconnects
    // if(!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUserNames();

    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);

  })

  //send message
  socket.on('sendMessage', function(data){
    io.sockets.emit('newMessage', {user:socket.username, msg: data});
  });

  //new user
  socket.on('newUser', function(data, callback){
    callback(true);
    console.log(data);
    socket.username = data;
    users.push(socket.username);
    updateUserNames();
  });

  function updateUserNames(){
    io.sockets.emit('getUsers', users);
  }
});
