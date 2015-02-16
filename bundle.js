(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/projects/npmutils/budo-ball-example/index.js":[function(require,module,exports){
var Point = require('verlet-point')
var World = require('verlet-system')
var keycode = require('keycode')
var css = require('dom-css')

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
    // ball.radius = 10
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
},{"2d-context":"/projects/npmutils/budo-ball-example/node_modules/2d-context/index.js","dom-css":"/projects/npmutils/budo-ball-example/node_modules/dom-css/index.js","domready":"/projects/npmutils/budo-ball-example/node_modules/domready/ready.js","keycode":"/projects/npmutils/budo-ball-example/node_modules/keycode/index.js","raf-loop":"/projects/npmutils/budo-ball-example/node_modules/raf-loop/index.js","verlet-point":"/projects/npmutils/budo-ball-example/node_modules/verlet-point/2d.js","verlet-system":"/projects/npmutils/budo-ball-example/node_modules/verlet-system/2d.js"}],"/projects/npmutils/budo-ball-example/node_modules/2d-context/index.js":[function(require,module,exports){
module.exports = function createCanvas2D(opt) {
    if (typeof document === 'undefined')
        return null
    opt = opt||{}
    var canvas = opt.canvas || document.createElement('canvas')
    if (typeof opt.width === 'number')
        canvas.width = opt.width
    if (typeof opt.height === 'number')
        canvas.height = opt.height
    try {
        return canvas.getContext('2d', opt) || null
    } catch (e) {
        return null
    }
}
},{}],"/projects/npmutils/budo-ball-example/node_modules/dom-css/index.js":[function(require,module,exports){
var prefix = require('prefix-style')
var toCamelCase = require('to-camel-case')
var cache = { 'float': 'cssFloat' }

var suffixMap = {}
;['top','right','bottom','left',
    'width','height','fontSize',
    'paddingLeft','paddingRight',
    'paddingTop','paddingBottom',
    'marginLeft','marginRight',
    'marginTop','marginBottom',
    'padding','margin','perspective'
].forEach(function(prop) {
    suffixMap[prop] = 'px'
})

function style(element, property, value) {
    var camel = cache[property]
    if (typeof camel === 'undefined')
        camel = detect(property)

    //may be false if CSS prop is unsupported
    if (camel) {
        if (value === undefined)
            return element.style[camel]

        if (typeof value === 'number')
            value = value + (suffixMap[camel]||'')
        element.style[camel] = value
    }
}

function each(element, properties) {
    for (var k in properties) {
        if (properties.hasOwnProperty(k)) {
            style(element, k, properties[k])
        }
    }
}

function detect(cssProp) {
    var camel = toCamelCase(cssProp)
    var result = prefix(camel)
    cache[camel] = cache[cssProp] = cache[result] = result
    return result
}

function set() {
    'use strict';
    if (arguments.length === 2) {
        each(arguments[0], arguments[1])
    } else
        style(arguments[0], arguments[1], arguments[2])
}

module.exports = set
module.exports.set = set

module.exports.get = function(element, properties) {
    if (Array.isArray(properties))
        return properties.reduce(function(obj, prop) {
            obj[prop] = style(element, prop||'')
            return obj
        }, {})
    else
        return style(element, properties||'')
}

},{"prefix-style":"/projects/npmutils/budo-ball-example/node_modules/dom-css/node_modules/prefix-style/index.js","to-camel-case":"/projects/npmutils/budo-ball-example/node_modules/dom-css/node_modules/to-camel-case/index.js"}],"/projects/npmutils/budo-ball-example/node_modules/dom-css/node_modules/prefix-style/index.js":[function(require,module,exports){
var elem = null

//https://gist.github.com/paulirish/523692
module.exports = function prefix(prop) {
    var prefixes = ['Moz', 'Khtml', 'Webkit', 'O', 'ms'],
        upper = prop.charAt(0).toUpperCase() + prop.slice(1)
    
    if (!elem)
        elem = document.createElement('div')

    if (prop in elem.style)
        return prop

    for (var len = prefixes.length; len--;) {
        if ((prefixes[len] + upper) in elem.style)
            return (prefixes[len] + upper)
    }
    return false
}
},{}],"/projects/npmutils/budo-ball-example/node_modules/dom-css/node_modules/to-camel-case/index.js":[function(require,module,exports){

var toSpace = require('to-space-case');


/**
 * Expose `toCamelCase`.
 */

module.exports = toCamelCase;


/**
 * Convert a `string` to camel case.
 *
 * @param {String} string
 * @return {String}
 */


function toCamelCase (string) {
  return toSpace(string).replace(/\s(\w)/g, function (matches, letter) {
    return letter.toUpperCase();
  });
}
},{"to-space-case":"/projects/npmutils/budo-ball-example/node_modules/dom-css/node_modules/to-camel-case/node_modules/to-space-case/index.js"}],"/projects/npmutils/budo-ball-example/node_modules/dom-css/node_modules/to-camel-case/node_modules/to-space-case/index.js":[function(require,module,exports){

var clean = require('to-no-case');


/**
 * Expose `toSpaceCase`.
 */

module.exports = toSpaceCase;


/**
 * Convert a `string` to space case.
 *
 * @param {String} string
 * @return {String}
 */


function toSpaceCase (string) {
  return clean(string).replace(/[\W_]+(.|$)/g, function (matches, match) {
    return match ? ' ' + match : '';
  });
}
},{"to-no-case":"/projects/npmutils/budo-ball-example/node_modules/dom-css/node_modules/to-camel-case/node_modules/to-space-case/node_modules/to-no-case/index.js"}],"/projects/npmutils/budo-ball-example/node_modules/dom-css/node_modules/to-camel-case/node_modules/to-space-case/node_modules/to-no-case/index.js":[function(require,module,exports){

/**
 * Expose `toNoCase`.
 */

module.exports = toNoCase;


/**
 * Test whether a string is camel-case.
 */

var hasSpace = /\s/;
var hasCamel = /[a-z][A-Z]/;
var hasSeparator = /[\W_]/;


/**
 * Remove any starting case from a `string`, like camel or snake, but keep
 * spaces and punctuation that may be important otherwise.
 *
 * @param {String} string
 * @return {String}
 */

function toNoCase (string) {
  if (hasSpace.test(string)) return string.toLowerCase();

  if (hasSeparator.test(string)) string = unseparate(string);
  if (hasCamel.test(string)) string = uncamelize(string);
  return string.toLowerCase();
}


/**
 * Separator splitter.
 */

var separatorSplitter = /[\W_]+(.|$)/g;


/**
 * Un-separate a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function unseparate (string) {
  return string.replace(separatorSplitter, function (m, next) {
    return next ? ' ' + next : '';
  });
}


/**
 * Camelcase splitter.
 */

var camelSplitter = /(.)([A-Z]+)/g;


/**
 * Un-camelcase a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function uncamelize (string) {
  return string.replace(camelSplitter, function (m, previous, uppers) {
    return previous + ' ' + uppers.toLowerCase().split('').join(' ');
  });
}
},{}],"/projects/npmutils/budo-ball-example/node_modules/domready/ready.js":[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? fn() : fns.push(fn)
  }

});

},{}],"/projects/npmutils/budo-ball-example/node_modules/keycode/index.js":[function(require,module,exports){
// Source: http://jsfiddle.net/vWx8V/
// http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes



/**
 * Conenience method returns corresponding value for given keyName or keyCode.
 *
 * @param {Mixed} keyCode {Number} or keyName {String}
 * @return {Mixed}
 * @api public
 */

exports = module.exports = function(searchInput) {
  // Keyboard Events
  if (searchInput && 'object' === typeof searchInput) {
    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode
    if (hasKeyCode) searchInput = hasKeyCode
  }

  // Numbers
  if ('number' === typeof searchInput) return names[searchInput]

  // Everything else (cast to string)
  var search = String(searchInput)

  // check codes
  var foundNamedKey = codes[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // check aliases
  var foundNamedKey = aliases[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // weird character?
  if (search.length === 1) return search.charCodeAt(0)

  return undefined
}

/**
 * Get by name
 *
 *   exports.code['enter'] // => 13
 */

var codes = exports.code = exports.codes = {
  'backspace': 8,
  'tab': 9,
  'enter': 13,
  'shift': 16,
  'ctrl': 17,
  'alt': 18,
  'pause/break': 19,
  'caps lock': 20,
  'esc': 27,
  'space': 32,
  'page up': 33,
  'page down': 34,
  'end': 35,
  'home': 36,
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'insert': 45,
  'delete': 46,
  'command': 91,
  'right click': 93,
  'numpad *': 106,
  'numpad +': 107,
  'numpad -': 109,
  'numpad .': 110,
  'numpad /': 111,
  'num lock': 144,
  'scroll lock': 145,
  'my computer': 182,
  'my calculator': 183,
  ';': 186,
  '=': 187,
  ',': 188,
  '-': 189,
  '.': 190,
  '/': 191,
  '`': 192,
  '[': 219,
  '\\': 220,
  ']': 221,
  "'": 222,
}

// Helper aliases

var aliases = exports.aliases = {
  'windows': 91,
  '⇧': 16,
  '⌥': 18,
  '⌃': 17,
  '⌘': 91,
  'ctl': 17,
  'control': 17,
  'option': 18,
  'pause': 19,
  'break': 19,
  'caps': 20,
  'escape': 27,
  'spc': 32,
  'pgup': 33,
  'pgdn': 33,
  'ins': 45,
  'del': 46,
  'cmd': 91
}


/*!
 * Programatically add the following
 */

// lower case chars
for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32

// numbers
for (var i = 48; i < 58; i++) codes[i - 48] = i

// function keys
for (i = 1; i < 13; i++) codes['f'+i] = i + 111

// numpad keys
for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96

/**
 * Get by code
 *
 *   exports.name[13] // => 'Enter'
 */

var names = exports.names = exports.title = {} // title for backward compat

// Create reverse mapping
for (i in codes) names[codes[i]] = i

// Add aliases
for (var alias in aliases) {
  codes[alias] = aliases[alias]
}

},{}],"/projects/npmutils/budo-ball-example/node_modules/raf-loop/index.js":[function(require,module,exports){
var inherits = require('inherits')
var EventEmitter = require('events').EventEmitter
var raf = require('raf')
var now = require('right-now')

module.exports = Engine
function Engine(fn) {
    if (!(this instanceof Engine)) 
        return new Engine(fn)
    this.running = false
    this.last = now()
    this._frame = 0
    this._tick = this.tick.bind(this)

    if (fn)
        this.on('tick', fn)
}

inherits(Engine, EventEmitter)

Engine.prototype.start = function() {
    if (this.running) 
        return
    this.running = true
    this.last = now()
    this._frame = raf(this._tick)
    return this
}

Engine.prototype.stop = function() {
    this.running = false
    if (this._frame !== 0)
        raf.cancel(this._frame)
    this._frame = 0
    return this
}

Engine.prototype.tick = function() {
    this._frame = raf(this._tick)
    var time = now()
    var dt = time - this.last
    this.emit('tick', dt)
    this.last = time
}
},{"events":"/projects/npmutils/budo-ball-example/node_modules/watchify/node_modules/browserify/node_modules/events/events.js","inherits":"/projects/npmutils/budo-ball-example/node_modules/raf-loop/node_modules/inherits/inherits_browser.js","raf":"/projects/npmutils/budo-ball-example/node_modules/raf-loop/node_modules/raf/index.js","right-now":"/projects/npmutils/budo-ball-example/node_modules/raf-loop/node_modules/right-now/browser.js"}],"/projects/npmutils/budo-ball-example/node_modules/raf-loop/node_modules/inherits/inherits_browser.js":[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],"/projects/npmutils/budo-ball-example/node_modules/raf-loop/node_modules/raf/index.js":[function(require,module,exports){
var now = require('performance-now')
  , global = typeof window === 'undefined' ? {} : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = global['request' + suffix]
  , caf = global['cancel' + suffix] || global['cancelRequest' + suffix]
  , isNative = true

for(var i = 0; i < vendors.length && !raf; i++) {
  raf = global[vendors[i] + 'Request' + suffix]
  caf = global[vendors[i] + 'Cancel' + suffix]
      || global[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  isNative = false

  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  if(!isNative) {
    return raf.call(global, fn)
  }
  return raf.call(global, function() {
    try{
      fn.apply(this, arguments)
    } catch(e) {
      setTimeout(function() { throw e }, 0)
    }
  })
}
module.exports.cancel = function() {
  caf.apply(global, arguments)
}

},{"performance-now":"/projects/npmutils/budo-ball-example/node_modules/raf-loop/node_modules/raf/node_modules/performance-now/lib/performance-now.js"}],"/projects/npmutils/budo-ball-example/node_modules/raf-loop/node_modules/raf/node_modules/performance-now/lib/performance-now.js":[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.6.3
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

/*
//@ sourceMappingURL=performance-now.map
*/

}).call(this,require('_process'))
},{"_process":"/projects/npmutils/budo-ball-example/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js"}],"/projects/npmutils/budo-ball-example/node_modules/raf-loop/node_modules/right-now/browser.js":[function(require,module,exports){
(function (global){
module.exports =
  global.performance &&
  global.performance.now ? function now() {
    return performance.now()
  } : Date.now || function now() {
    return +new Date
  }

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/projects/npmutils/budo-ball-example/node_modules/verlet-point/2d.js":[function(require,module,exports){
var vec2 = {
    create: require('gl-vec2/create'),
    sub: require('gl-vec2/subtract'),
    copy: require('gl-vec2/copy')
}
module.exports = require('./lib/build')(vec2)
},{"./lib/build":"/projects/npmutils/budo-ball-example/node_modules/verlet-point/lib/build.js","gl-vec2/copy":"/projects/npmutils/budo-ball-example/node_modules/verlet-point/node_modules/gl-vec2/copy.js","gl-vec2/create":"/projects/npmutils/budo-ball-example/node_modules/verlet-point/node_modules/gl-vec2/create.js","gl-vec2/subtract":"/projects/npmutils/budo-ball-example/node_modules/verlet-point/node_modules/gl-vec2/subtract.js"}],"/projects/npmutils/budo-ball-example/node_modules/verlet-point/lib/build.js":[function(require,module,exports){
module.exports = function(vec) {
    function Point(opt) {
        this.position = vec.create()
        this.previous = vec.create()
        this.acceleration = vec.create()
        this.mass = 1.0
        this.radius = 0

        if (opt && typeof opt.mass === 'number')
            this.mass = opt.mass
        if (opt && typeof opt.radius === 'number')
            this.radius = opt.radius

        if (opt && opt.position) 
            vec.copy(this.position, opt.position)
        
        if (opt && (opt.previous||opt.position)) 
            vec.copy(this.previous, opt.previous || opt.position)
        
        if (opt && opt.acceleration)
            vec.copy(this.acceleration, opt.acceleration)
    }

    Point.prototype.addForce = function(v) {
        vec.sub(this.previous, this.previous, v)
        return this
    }

    Point.prototype.place = function(v) {
        vec.copy(this.position, v)
        vec.copy(this.previous, v)
        return this
    }

    return function(opt) {
        return new Point(opt)
    }
}
},{}],"/projects/npmutils/budo-ball-example/node_modules/verlet-point/node_modules/gl-vec2/copy.js":[function(require,module,exports){
module.exports = copy

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
function copy(out, a) {
    out[0] = a[0]
    out[1] = a[1]
    return out
}
},{}],"/projects/npmutils/budo-ball-example/node_modules/verlet-point/node_modules/gl-vec2/create.js":[function(require,module,exports){
module.exports = create

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
function create() {
    var out = new Float32Array(2)
    out[0] = 0
    out[1] = 0
    return out
}
},{}],"/projects/npmutils/budo-ball-example/node_modules/verlet-point/node_modules/gl-vec2/subtract.js":[function(require,module,exports){
module.exports = subtract

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function subtract(out, a, b) {
    out[0] = a[0] - b[0]
    out[1] = a[1] - b[1]
    return out
}
},{}],"/projects/npmutils/budo-ball-example/node_modules/verlet-system/2d.js":[function(require,module,exports){
var vec2 = {
    create: require('gl-vec2/create'),
    add: require('gl-vec2/add'),
    multiply: require('gl-vec2/multiply'),
    sub: require('gl-vec2/subtract'),
    scale: require('gl-vec2/scale'),
    copy: require('gl-vec2/copy'),
    sqrLen: require('gl-vec2/squaredLength'),
    fromValues: require('gl-vec2/fromValues'),
}
module.exports = require('./lib/build')(vec2)
},{"./lib/build":"/projects/npmutils/budo-ball-example/node_modules/verlet-system/lib/build.js","gl-vec2/add":"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/gl-vec2/add.js","gl-vec2/copy":"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/gl-vec2/copy.js","gl-vec2/create":"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/gl-vec2/create.js","gl-vec2/fromValues":"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/gl-vec2/fromValues.js","gl-vec2/multiply":"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/gl-vec2/multiply.js","gl-vec2/scale":"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/gl-vec2/scale.js","gl-vec2/squaredLength":"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/gl-vec2/squaredLength.js","gl-vec2/subtract":"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/gl-vec2/subtract.js"}],"/projects/npmutils/budo-ball-example/node_modules/verlet-system/lib/box-collision.js":[function(require,module,exports){
module.exports = function(vec) {
    var negInfinity = vec.fromValues(-Infinity, -Infinity, -Infinity)
    var posInfinity = vec.fromValues(Infinity, Infinity, Infinity)
    var ones = vec.fromValues(1, 1, 1)
    var reflect = vec.create()
    var EPSILON = 0.000001

    return function collider(p, velocity, min, max, friction) {
        if (!min && !max)
            return
            
        //reset reflection 
        vec.copy(reflect, ones)

        min = min || negInfinity
        max = max || posInfinity

        var i = 0,
            n = p.position.length,
            hit = false,
            radius = p.radius || 0

        //bounce and clamp
        for (i=0; i<n; i++)
            if (typeof min[i] === 'number' && p.position[i]-radius < min[i]) {
                reflect[i] = -1
                p.position[i] = min[i]+radius
                hit = true
            }
        for (i=0; i<n; i++)
            if (typeof max[i] === 'number' && p.position[i]+radius > max[i]) {
                reflect[i] = -1
                p.position[i] = max[i]-radius
                hit = true
            }

        //no bounce
        var len2 = vec.sqrLen(velocity)
        if (!hit || len2 <= EPSILON)
            return

        var m = Math.sqrt(len2)
        if (m !== 0) 
            vec.scale(velocity, velocity, 1/m)

        //scale bounce by friction
        vec.scale(reflect, reflect, m * friction)

        //bounce back
        vec.multiply(velocity, velocity, reflect)
    }
}
},{}],"/projects/npmutils/budo-ball-example/node_modules/verlet-system/lib/build.js":[function(require,module,exports){
var number = require('as-number')
var clamp = require('clamp')
var createCollider = require('./box-collision')

module.exports = function create(vec) {
    
    var collide = createCollider(vec)

    var velocity = vec.create()
    var tmp = vec.create()
    var zero = vec.create()
    
    function VerletSystem(opt) {
        if (!(this instanceof VerletSystem))
            return new VerletSystem(opt)
        
        opt = opt||{}

        this.gravity = opt.gravity || vec.create()
        this.friction = number(opt.friction, 0.98)
        this.min = opt.min
        this.max = opt.max
        this.bounce = number(opt.bounce, 1)
    }
    
    VerletSystem.prototype.collision = function(p, velocity) {
        collide(p, velocity, this.min, this.max, this.bounce)
    }

    VerletSystem.prototype.integratePoint = function(point, delta) {
        var mass = typeof point.mass === 'number' ? point.mass : 1

        //if mass is zero, assume body is static / unmovable
        if (mass === 0) {
            this.collision(point, zero)
            vec.copy(point.acceleration, zero)
            return
        }

        vec.add(point.acceleration, point.acceleration, this.gravity)
        vec.scale(point.acceleration, point.acceleration, mass)
            
        //difference in positions
        vec.sub(velocity, point.position, point.previous)

        //dampen velocity
        vec.scale(velocity, velocity, this.friction)

        //handle custom collisions in 2D or 3D space
        this.collision(point, velocity)

        //set last position
        vec.copy(point.previous, point.position)
        var tSqr = delta * delta
            
        //integrate
        vec.scale(tmp, point.acceleration, 0.5 * tSqr)
        vec.add(point.position, point.position, velocity)
        vec.add(point.position, point.position, tmp)

        //reset acceleration
        vec.copy(point.acceleration, zero)
    }

    VerletSystem.prototype.integrate = function(points, delta) {
        for (var i=0; i<points.length; i++) {
            this.integratePoint(points[i], delta)
        }
    }

    return VerletSystem
}
},{"./box-collision":"/projects/npmutils/budo-ball-example/node_modules/verlet-system/lib/box-collision.js","as-number":"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/as-number/index.js","clamp":"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/clamp/index.js"}],"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/as-number/index.js":[function(require,module,exports){
module.exports = function numtype(num, def) {
	return typeof num === 'number'
		? num 
		: (typeof def === 'number' ? def : 0)
}
},{}],"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/clamp/index.js":[function(require,module,exports){
module.exports = clamp

function clamp(value, min, max) {
  return min < max
    ? (value < min ? min : value > max ? max : value)
    : (value < max ? max : value > min ? min : value)
}

},{}],"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/gl-vec2/add.js":[function(require,module,exports){
module.exports = add

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function add(out, a, b) {
    out[0] = a[0] + b[0]
    out[1] = a[1] + b[1]
    return out
}
},{}],"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/gl-vec2/copy.js":[function(require,module,exports){
arguments[4]["/projects/npmutils/budo-ball-example/node_modules/verlet-point/node_modules/gl-vec2/copy.js"][0].apply(exports,arguments)
},{}],"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/gl-vec2/create.js":[function(require,module,exports){
arguments[4]["/projects/npmutils/budo-ball-example/node_modules/verlet-point/node_modules/gl-vec2/create.js"][0].apply(exports,arguments)
},{}],"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/gl-vec2/fromValues.js":[function(require,module,exports){
module.exports = fromValues

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
function fromValues(x, y) {
    var out = new Float32Array(2)
    out[0] = x
    out[1] = y
    return out
}
},{}],"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/gl-vec2/multiply.js":[function(require,module,exports){
module.exports = multiply

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function multiply(out, a, b) {
    out[0] = a[0] * b[0]
    out[1] = a[1] * b[1]
    return out
}
},{}],"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/gl-vec2/scale.js":[function(require,module,exports){
module.exports = scale

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
function scale(out, a, b) {
    out[0] = a[0] * b
    out[1] = a[1] * b
    return out
}
},{}],"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/gl-vec2/squaredLength.js":[function(require,module,exports){
module.exports = squaredLength

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
    var x = a[0],
        y = a[1]
    return x*x + y*y
}
},{}],"/projects/npmutils/budo-ball-example/node_modules/verlet-system/node_modules/gl-vec2/subtract.js":[function(require,module,exports){
arguments[4]["/projects/npmutils/budo-ball-example/node_modules/verlet-point/node_modules/gl-vec2/subtract.js"][0].apply(exports,arguments)
},{}],"/projects/npmutils/budo-ball-example/node_modules/watchify/node_modules/browserify/node_modules/events/events.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],"/projects/npmutils/budo-ball-example/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},["/projects/npmutils/budo-ball-example/index.js"]);
