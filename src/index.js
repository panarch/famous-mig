'use strict';

/*
// Famous dependencies
var DOMElement = require('famous/dom-renderables/DOMElement');
var FamousEngine = require('famous/core/FamousEngine');

// Boilerplate code to make your life easier
FamousEngine.init();

// Initialize with a scene; then, add a 'node' to the scene root
var logo = FamousEngine.createScene().addChild();

// Create an [image] DOM element providing the logo 'node' with the 'src' path
new DOMElement(logo, { tagName: 'img' })
    .setAttribute('src', './images/famous_logo.png');

// Chainable API
logo
    // Set size mode to 'absolute' to use absolute pixel values: (width 250px, height 250px)
    .setSizeMode('absolute', 'absolute', 'absolute')
    .setAbsoluteSize(250, 250)
    // Center the 'node' to the parent (the screen, in this instance)
    .setAlign(0.5, 0.5)
    // Set the translational origin to the center of the 'node'
    .setMountPoint(0.5, 0.5)
    // Set the rotational origin to the center of the 'node'
    .setOrigin(0.5, 0.5);

// Add a spinner component to the logo 'node' that is called, every frame
var spinner = logo.addComponent({
    onUpdate: function(time) {
        logo.setRotation(0, time / 1000, 0);
        logo.requestUpdateOnNextTick(spinner);
    }
});

// Let the magic begin...
logo.requestUpdate(spinner);
*/

var Engine = require('../core/Engine');
var Surface = require('../core/Surface');
var Modifier = require('../core/Modifier');
var Transform = require('../core/Transform');
var ImageSurface = require('../surfaces/ImageSurface');
var CanvasSurface = require('../surfaces/CanvasSurface');
var ContainerSurface = require('../surfaces/ContainerSurface');
var StateModifier = require('../modifiers/StateModifier');
var SequentialLayout = require('../views/SequentialLayout');
var GridLayout = require('../views/GridLayout');
var Utility = require('../utilities/Utility');
var Easing = require('../transitions/Easing');

var ctx = Engine.createContext();

var modifier = new StateModifier({
    size: [undefined, 100],
    align: [0.7, 0.5],
    origin: [0.5, 0.5],
    proportions: [0.2, 1],
    opacity: 0.5
    //transform: Transform.thenMove(Transform.rotateZ(Math.PI / 3), [200, 50, 0])
});

modifier.setAlign([0.5, 0.5], { duration: 2000, curve: Easing.inExpo });
modifier.setTransform(Transform.thenMove(Transform.rotateZ(Math.PI / 3), [200, 50, 0]), { duration: 2000, curve: Easing.inExpo });

var surface = new Surface({
    content: 'HI',
    properties: {
        backgroundColor: 'red',
        color: 'white',
        textAlign: 'center',
        fontSize: '40px',
        borderRadius: '10px'
    }
});

var container = new ContainerSurface({
    size: [200, 200],
    properties: {
        border: '1px',
        backgroundColor: '#eaeaea'
    }
});

var m2 = new Modifier({
    size: [30, 30],
    align: [0.1, 0],
    origin: [0, 0],
    transform: Transform.translate(0, 10)
});

var s2 = new Surface({
    properties: {
        backgroundColor: 'blue'
    }
});

var m3 = new Modifier({
    size: [40, 40],
    align: [0.9, 0.9],
    origin: [1, 1],
    transform: Transform.rotateZ(Math.PI / 6)
});

var s3 = new Surface({
    properties: {
        backgroundColor: 'green'
    }
});

/**
 * Sequential Layout
 */
var sequentialModifier = new Modifier({
    size: [200, 80],
    align: [0.5, 0.5],
    origin: [0.5, 0.5]
});

var sequentialLayout = new SequentialLayout({
    direction: Utility.Direction.X
});

var s4 = new ImageSurface({
    size: [80, 80],
    content: './images/famous_logo.png'
});

var s5 = new Surface({
    size: [120, 80],
    content: 'Example',
    properties: {
        textAlign: 'center',
        lineHeight: '80px',
        backgroundColor: '#eaeaea'
    }
});

sequentialLayout.sequenceFrom([s4, s5]);

/*
 * CanvasSurface
 */
var m5 = new Modifier({
    size: [100, 100],
    align: [0, 0],
    origin: [0, 0],
    transform: Transform.translate(0, 200)
});

var s6 = new CanvasSurface({
    canvasSize: [200, 200],
    properties: {
        backgroundColor: '#aeaeae'
    }
});

s6.on('deploy', function() {
    // test drawing: white circle
    var ctx = s6.getContext('2d');
    var w = s6.getSize()[0];
    ctx.beginPath();
    ctx.arc(w, w, 30, -0.5 * Math.PI, 1.5 * Math.PI);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 10;
    ctx.stroke();
});

/*
 * GridLayout
 */
var gridModifier = new Modifier({
    size: [200, 200],
    transform: Transform.translate(0, 300)
});

var gridLayout = new GridLayout({
    dimensions: [3, 4]
});

function getItem() {
    var r = (Math.random() * 256) | 0;
    var g = (Math.random() * 256) | 0;
    var b = (Math.random() * 256) | 0;
    var color = 'rgb({r},{g},{b})'
        .replace('{r}', r)
        .replace('{g}', g)
        .replace('{b}', b);

    return new Surface({
        properties: {
            backgroundColor: color
        }
    });
}

var items = [];
for (var i = 0; i < 10; i++) {
    items.push(getItem());
}

gridLayout.sequenceFrom(items);

ctx.add(modifier).add(surface);
container.add(m2).add(s2);
container.add(m3).add(s3);
ctx.add(container);
ctx.add(sequentialModifier).add(sequentialLayout);
ctx.add(m5).add(s6);
ctx.add(gridModifier).add(gridLayout);
