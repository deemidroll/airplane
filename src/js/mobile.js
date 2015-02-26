var $ = window.$;
$(function() {
    // Game config
    var io = window.io,
        server = window.location.origin,
        hash = window.location.hash,
        socket,
        $ui2 = $('.ui2');

    var started = false;

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

    function onSwipeUp(e) {
        if (started) return;
        started = true;
        // $('#start').off('swipeUp');
        $('.start').addClass('hidden');
        $('.control').removeClass('hidden');
        console.log(e);
        socket.emit('start', {});
        $('#audioloop')[0].play();
    }

    function orientationHandler (event) {
        var b = event.beta,  // left/right 'tilt'
            g = event.gamma; // forward/back 'tilt'

        var turn = 0, x = 0, ori = window.orientation || 0;
        if (ori === 0) {
            turn = g;
            x = b;
        }
        if (ori === 90) {
            turn = b;
            x = -g;
        }
        if (ori === -90) {
            turn = -b;
            x = g;
        }

        $ui2.css({
            '-webkit-transform': 'rotate(' + -turn + 'deg)',
            '-ms-transform': 'rotate(' + -turn + 'deg)',
            'transform': 'rotate(' + -turn + 'deg)'
        });

        $('#start').on('swipeUp', onSwipeUp);
        socket.emit('turn', {'turn':turn, 'x':x});
    }
    // // Steer the vehicle based on the phone orientation
    window.addEventListener('deviceorientation', orientationHandler, false);

    $(document).on('touchmove',function(e){
        e.preventDefault();
    });
});
