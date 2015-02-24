/* Made by deemidroll | 2014 | deemidroll@gmail.com */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Dmitry/projects/helicopter/tech/airplane/src/js/mobile.js":[function(require,module,exports){
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

},{}]},{},["/Users/Dmitry/projects/helicopter/tech/airplane/src/js/mobile.js"])