var io = window.io;
var $ = window.$;

// var server = window.location.origin !== 'http://localhost' ? window.location.origin : 'http://192.168.1.38';
var server = 'http://localhost:8080';
var socket;
var ws = {};

// var $window = $(window);
var $document = $(document);

ws.init = function() {
    console.log(server);
    // set socket
    socket = ws.socket = io.connect(server);
    // When initial welcome message, reply with 'game' device type
    socket.on('welcome', function() {
        socket.emit('device', {'type':'game'});
    });
    // We receive our game code to show the user
    socket.on('initialize', function(gameCode) {
        socket.gameCode = gameCode;
        $document.trigger('socketInitialized', {gameCode: gameCode, server: server});
    });
    // When the user inputs the code into the phone client, we become 'connected'. Start the game.
    socket.on('connected', function(data) {
        $document.trigger('socketConnected', data);
    });
    // When the phone is turned, change destPoint
    socket.on('turn', function(data) {
        $document.trigger('turn', data);
        // if (DT.enableMobileSatus === 'enabled') DT.handlers.turnHandler(turn);;
    });
    socket.on('click', function(click) {
        console.log('click', click);
        // if (DT.enableMobileSatus === 'enabled') DT.handlers[click]();
    });
    socket.on('start', function(data) {
        console.log('start', data);
    });
    // DT.$document.on('changeScore', function (e, data) {
    //     DT.sendMessage({type: 'vibr', time: 10});
    // });
};
ws.sendMessage = function (options) {
    var data = {
        'type': options.type,
        'gameCode': socket.socket.gameCode,
        'sessionid': socket.socket.socket.sessionid
    };
    if (socket.socket) {
        socket.socket.emit('message', data);
    }
};

// DT.$document.on('startGame', function (e, data) {
//     DT.sendMessage({type: 'gamestarted'});
// });
// DT.$document.on('startGame', function (e, data) {
//     if (data.control === 'mobile') DT.enableMobileSatus = 'enabled';
// });
// DT.$document.on('resetGame', function (e, data) {
//     if (data.cause === 'chooseControl') DT.enableMobileSatus = 'disabled';
// });
// DT.$document.on('gameOver', function (e, data) {
//     DT.sendMessage({type: 'gameover'});
// });
// DT.$document.on('checkup', function (e, data) {
//     DT.sendMessage({type: 'checkup', dogecoinId: data.dogecoinId});
// });
// DT.$document.on('resetGame', function (e, data) {
//     DT.sendMessage({type: 'resetGame'});
// });

module.exports = ws;
