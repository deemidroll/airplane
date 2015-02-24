var express = require('express'),
    io = require('socket.io');

var app = express();

app.use('/', express.static('build'));

var server = app.listen(8080, function() {
    console.log('Listening on port %d', server.address().port);
});

function genRandomFloorBetween(min, max) {
    var rand = min - 0.5 + Math.random()*(max-min+1);
    rand = Math.round(rand);
    return rand;
}

function genGameCode() {
    var code = genRandomFloorBetween(0, 999999).toString();
    while (code.length < 6) {
        code = '0' + code;
    }
    return code;
}

io = io.listen(server, { log: true });

var socketCodes = {};

io.sockets.on('connection', function(socket) {
    // console.log(socket);
    // Confirm the connection
    socket.emit('welcome', {});

    socket.on('message', function (data) {
        // ...emit a 'message' event to every other socket
        for (var socket in io.sockets.sockets) {
            if (io.sockets.sockets.hasOwnProperty(socket)) {
                if (io.sockets.sockets[socket].gameCode === data.gameCode) {
                    io.sockets.sockets[socket].emit('message', data);
                }
            }
        }
    });

    // Receive the client device type
    socket.on('device', function(data) {
        // if client is a browser game
        if (data.type == 'game') {
            // Generate a code
            var gameCode = genGameCode();
            // Ensure uniqueness
            while(gameCode in socketCodes) {
                gameCode = genGameCode();
            }

            // Store game code -> socket association
            socketCodes[gameCode] = socket;
            socket.gameCode = gameCode;

            // Tell game client to initialize
            //  and show the game code to the user
            socket.emit('initialize', gameCode);

        } else if (data.type == 'controller') { // if client is a phone controller
            // if game code is valid...
            if(data.gameCode in socketCodes) {
                // save the game code for controller commands
                socket.gameCode = data.gameCode;
                // initialize the controller
                socket.emit('connected', {});

                // start the game
                if(data.gameCode && data.gameCode in socketCodes) {
                    socketCodes[data.gameCode].emit('connected', {});
                }
                socket.emit('message', {type: 'vibr', time: 100});
            } else {  // else game code is invalid, send fail message and disconnect
                socket.emit('fail', {});
                socket.emit('message', {type: 'vibr', time: 1000});
                socket.disconnect();
            }
        }
    });
    // send accelerate command to game client
    socket.on('accelerate', function(data) {
        var bAccelerate = data.accelerate;
        if(socket.gameCode && socket.gameCode in socketCodes) {
            socketCodes[socket.gameCode].emit('accelerate', bAccelerate);
        }
    });
    // send turn command to game client
    socket.on('turn', function(data) {
        if(socket.gameCode && socket.gameCode in socketCodes) {
            socketCodes[socket.gameCode].emit('turn', data);
        }
    });
    // send click command to game client
    socket.on('click', function(data) {
        if(socket.gameCode && socket.gameCode in socketCodes) {
            socketCodes[socket.gameCode].emit('click', data.click);
        }
    });
    // send start command to game client
    socket.on('start', function(data) {
        if(socket.gameCode && socket.gameCode in socketCodes) {
            socketCodes[socket.gameCode].emit('start', data);
        }
    });
    // send disconnect command to game client
    socket.on('disconnect', function(data) {
        if(socket.gameCode && socket.gameCode in socketCodes) {
            socketCodes[socket.gameCode].emit('disconnectController', data);
        }
    });
});
// When a client disconnects...
io.sockets.on('disconnect', function(socket) {
    // remove game code -> socket association on disconnect
    if(socket.gameCode && socket.gameCode in socketCodes) {
        delete socketCodes[socket.gameCode];
    }
});
