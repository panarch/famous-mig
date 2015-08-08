// @author Taehoon Moon 2015

'use strict';

var FamousEngine = require('famous/core/FamousEngine');

var View = require('./View');
var Timer = require('../utilities/Timer');

function Engine() {}

Engine.createContext = function createContext() {
    FamousEngine.init();

    var scene = FamousEngine.createScene();
    Timer.setNode(scene.addChild());

    var node = scene.addChild();
    var view = new View();
    view.setNode(node);

    return view;
};

module.exports = Engine;
