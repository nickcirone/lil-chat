var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clientIds = [];
var clientUsernames = [];
var messageCount = 0;

app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    socket.on('new user', function(userId) {
        clientIds.push(userId);
        clientUsernames.push('');
        var msg = 'user ' + userId + ' connected!';
        console.log(msg);
        io.emit('chat message', msg);
    });
    socket.on('username', function(arr) {
        var userIndex = clientIds.indexOf(socket.id);
        clientUsernames[userIndex] = arr[1];
        console.log('user ' + arr[0] + ' chose username: ' + arr[1]);
        io.emit('chat message', 'user ' + arr[0] + ' changed name to ' + arr[1]);
    });
    socket.on('disconnect', function() {
        var userIndex = clientIds.indexOf(socket.id);
        var departingUser = clientUsernames[userIndex];
        if (departingUser === '') {
            var msg = 'user '+ socket.id + ' left the chat.';
            console.log(msg);
            io.emit('chat message', msg);
        } else {
            var msg = departingUser + ' left the chat.';
            console.log(msg);
            io.emit('chat message', msg);
        }
        clientIds.splice(userIndex, 1);
        clientUsernames.splice(userIndex, 1);
    });
    socket.on('chat message', function(msg) {
        console.log('message ' + messageCount.toString() + ': ' + msg);
        io.emit('chat message', msg);
        messageCount++;
    });
});

http.listen(3000, function(){
  console.log('listening on port 3000');
});
