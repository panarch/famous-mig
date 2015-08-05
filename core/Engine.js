// @author Taehoon Moon 2015

'use strict';

var FamousEngine = require('famous/core/FamousEngine');

var View = require('./View');

function Engine() {}

Engine.createContext = function createContext() {
    FamousEngine.init();

    var node = FamousEngine.createScene().addChild();
    var view = new View();
    view.setNode(node);

    return view;
};

module.exports = Engine;
