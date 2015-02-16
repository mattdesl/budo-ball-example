# budo-ball-example

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

[![screenshot](http://i.imgur.com/LJP7d9I.png)](https://www.youtube.com/watch?v=cfgeN3G_Gl0)

<sup>[(click for demo)](https://www.youtube.com/watch?v=cfgeN3G_Gl0)</sup>


This is a small example of using [budō](https://github.com/mattdesl/budo) for rapid prototyping. 

To test:

```sh
git clone https://github.com/mattdesl/budo-ball-example.git
cd budo-ball-example
npm install
npm start
```

This will start bundling the file and serve it to `localhost:9966`. The script supports LiveReload, so you can save the `index.js` file to trigger a browser reload (without a browser extension).

## script injection

You can also test the experimental Chrome Script Injection feature with the following. Be sure to quit other instances of watchify/budo first.

```sh
npm run chrome
```

This should open a new instance of Chrome connected to the remote debugger on port 9222. Open up `index.js` and change some of the ball settings in the render loop to see them injected without losing application state (like time & position).

```js
...

require('raf-loop')(function(dt) {
    ctx.clearRect(0, 0, width, height)
    world.integratePoint(ball, 24/1000)

    //try changing these with budo-chrome running
    // ball.radius = 30
    // ball.mass = 0.25
    // ball.place([200, 100])
...
```

*Note:* In some cases, you may need to refresh the tab to get back into the interactive state. Also, opening DevTools or the console will disconnect the debugger.

Tested on OSX Yosemite. [Tweet me](https://twitter.com/mattdesl) or [open an issue](https://github.com/mattdesl/budo/issues) if you notice problems.

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/budo-ball-example/blob/master/LICENSE.md) for details.
