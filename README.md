# threejs-examples

This is a collection of some simple projects for getting started with [THREE.js](https://threejs.org) for mathematical visualization/illustration.

## Running the examples

Run the examples by opening `<foldername>/index.html` in your web browser.

## Coding

To edit the examples, you'll need a text editor. I recommend [VSCode](https://code.visualstudio.com/).

You'll want to keep the THREE.js documentation open: https://threejs.org/docs/

Here are some good resources for learning web development in general:

[MDN - HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)

[MDN - CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

[MDN - Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[Javascript.info](https://javascript.info/)

I believe the best way to learn web development is to go back and forth between going through a course/tutorial systematically (so you have a solid foundation) and tinkering with examples like the above to make them do what you want (so you have something interesting/fun to do)—even if you don't understand the code in its entirety.

For the `mobius` example, you will need to install [Node.js](https://nodejs.org/en/) and then run:
```
cd mobius
npm install
webpack --watch
```
to compile the code.

## Contents

Here are the examples and what techniques they demonstrate:

[basic](https://ysulyma.github.io/threejs-examples/basic/) Just a sphere with orbit controls.

[fancy](https://ysulyma.github.io/threejs-examples/fancy/) Parametric curves, parametric surfaces, and animation

[fractal](https://ysulyma.github.io/threejs-examples/fractal/) Demonstrates merging geometries, without which the scene would be unusably slow

[morse](https://ysulyma.github.io/threejs-examples/morse/) Adding drag functionality to a scene

[mobius](https://ysulyma.github.io/threejs-examples/mobius/) Another drag example; also demonstrates the use of TypeScript/Webpack

[span](https://ysulyma.github.io/threejs-examples/span/) Very rough: mathematically, illustrates the concept of span. Code-wise, shows how to wire up form elements; also demonstrates a store/subscribe pattern.
