var $ = window.$;
$(function() {
    // Game config
    var io = window.io,
        server = window.location.origin,
        hash = window.location.hash,
        socket,
        $ui2 = $('.ui2');

    console.log('hi');
    server = 'http://192.168.88.117:8080';

    // When connect is pushed, establish socket connection
    var connect = function(gameCode) {
        socket = io.connect(server);
        // When server replies with initial welcome...
        socket.on('welcome', function() {
            // Send 'controller' device type with our entered game code
            socket.emit('device', {'type':'controller', 'gameCode':gameCode});
        });
        // socket.on('message', function(data) {});
        // When game code is validated, we can begin playing...
        // socket.on('connected', function(data) {});
        // socket.on('fail', function() {});
    };
    if (hash) {
        connect(hash.slice(1));
    }

    function orientationHandler (event) {
        var a = event.alpha, // 'direction'
            b = event.beta,  // left/right 'tilt'
            g = event.gamma; // forward/back 'tilt'

        var turn = 0, ori = window.orientation || 0;
        if (ori === 0) turn = g;
        if (ori === 90) turn = b;
        if (ori === -90) turn = -b;

        $ui2.css({
            '-webkit-transform': 'rotate(' + -turn + 'deg)',
            '-ms-transform': 'rotate(' + -turn + 'deg)',
            'transform': 'rotate(' + -turn + 'deg)'
        });
        socket.emit('turn', {'turn':turn, 'g':a});
    }
    // // Steer the vehicle based on the phone orientation
    window.addEventListener('deviceorientation', orientationHandler, false);
});
