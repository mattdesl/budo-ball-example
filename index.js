var css = require('dom-css')
var Point = require('verlet-point')
var World = require('verlet-system')
var keycode = require('keycode')

var width = 500,
    height = 300

//get a 2D canvas context
var ctx = require('2d-context')({
    width: width,
    height: height
})

//setup our physics
var floor = 240
var ball = Point({
    position: [100, 100],
    radius: 30
})

function foo() {
    const bar = 'blah'
    bar = 2
    return bar
}

var world = World({
    gravity: [0, 700],
    friction: 1,
    min: [0, 0],
    max: [width, floor]
})

//render loop
require('raf-loop')(function(dt) {
    ctx.clearRect(0, 0, width, height)
    world.integratePoint(ball, 24/1000)

    //try changing these with budo-chrome running
    ball.radius = 30
    // ball.mass = 0.25
    // ball.place([200, 100])

    //draw floor
    ctx.fillRect(0, floor, width, 20)

    //draw ball
    ctx.beginPath()
    ctx.arc(ball.position[0], ball.position[1], ball.radius, 0, Math.PI*2, false)
    ctx.fill()
}).start()

//setup DOM state & info
require('domready')(function () {
    document.body.appendChild(ctx.canvas)
    
    var info = document.createElement('div')
    info.textContent = 'use A,D or LEFT,RIGHT to move ball'
    document.body.appendChild(info)

    //style elements
    css(ctx.canvas, 'background', 'white')
    css(document.body, {
        margin: 0,
        background: 'gray'
    })
    css(info, {
        position: 'absolute',
        top: 20,
        left: 20
    })

    addEvents()
})

function addEvents() {
    window.addEventListener('keydown', function(ev) {
        var key = keycode(ev)
        var dir = 0
        if (key === 'right' || key === 'd')
            dir = 1
        else if (key === 'left' || key === 'a')
            dir = -1
        ball.addForce([ dir * 0.1, 0 ])
    })
}