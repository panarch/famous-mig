// @author Taehoon Moon 2015

'use strict';

var DOMElement = require('famous/dom-renderables/DOMElement');
var Position = require('famous/components/Position');
var Rotation = require('famous/components/Rotation');
var Scale = require('famous/components/Scale');
var Align = require('famous/components/Align');
var Origin = require('famous/components/Origin');
var MountPoint = require('famous/components/MountPoint');
var Size = require('famous/components/Size');
var Opacity = require('famous/components/Opacity');

var Surface = require('../core/Surface');
var View = require('../core/View');

function StateModifier(options) {
    View.apply(this, arguments);

    this._onLoadCallbacks = [];

    this.transform = options.transform ? options.transform : null;
    this.opacity = options.opacity !== undefined ? options.opacity : null;
    this.origin = options.origin ? options.origin : null;
    this.align = options.align ? options.align : null;
    this.size = options.size ? options.size : null;
    this.proportions = options.proportions ? options.proportions : null;

    this.transformOptions = null;
    this.opacityOptions = null;
    this.originOptions = null;
    this.alignOptions = null;
    this.sizeOptions = null;
    this.proportionsOptions = null;

    this._positionComp = null;
    this._rotationComp = null;
    this._scaleComp = null;
    this._alignComp = null;
    this._originComp = null;
    this._mountPointComp = null;
    this._sizeComp = null;
    this._opacityComp = null;
}

StateModifier.prototype = Object.create(View.prototype);
StateModifier.prototype.constructor = StateModifier;

function _setComponentValue(component, value, options, callback) {
    component.set.apply(component, value.concat(options).concat(callback));
}

StateModifier.prototype.setTransform = function setTransform(transform, options, callback) {
    var position = transform.getPosition();
    var rotation = transform.getRotation();
    var scale = transform.getScale();

    while (position && position.length < 3) position.push(null);
    while (rotation && rotation.length < 3) rotation.push(null);
    while (scale && scale.length < 3) scale.push(1);

    var called = false;
    var _callback = callback;
    callback = function() {
        if (!called) {
            called = true;
            if (_callback) _callback();
        }
    };

    if (this.node) {
        if (position) _setComponentValue(this._positionComp, position, options, callback);
        if (rotation) _setComponentValue(this._rotationComp, rotation, options, callback);
        if (scale) _setComponentValue(this._scaleComp, scale, options, callback);
    }
    else if (options) {
        this._onLoadCallbacks.push((function() {
            this.transform = transform;
            this.transformOptions = options;
            if (position) _setComponentValue(this._positionComp, position, options, callback);
            if (rotation) _setComponentValue(this._rotationComp, rotation, options, callback);
            if (scale) _setComponentValue(this._scaleComp, scale, options, callback);
        }).bind(this));

        return;
    }

    this.transform = transform;
    this.transformOptions = options;
};

StateModifier.prototype.setOpacity = function setOpacity(opacity, options, callback) {
    if (this.node) {
        this._opacityComp.set(opacity, options, callback);
    }
    else if (options) {
        this._onLoadCallbacks.push((function() {
            this.opacity = opacity;
            this.opacityOptions = options;
            this._opacityComp.set(opacity, options, callback);
        }).bind(this));

        return;
    }

    this.opacity = opacity;
    this.opacityOptions = options;
};

StateModifier.prototype.setOrigin = function setOrigin(origin, options, callback) {
    while (origin.length < 3) origin.push(null);

    if (this.node) {
        _setComponentValue(this._originComp, origin, options, callback);
        _setComponentValue(this._mountPointComp, origin, options);
    }
    else if (options) {
        this._onLoadCallbacks.push((function() {
            this.origin = origin;
            this.originOptions = options;
            _setComponentValue(this._originComp, origin, options, callback);
            _setComponentValue(this._mountPointComp, origin, options);
        }).bind(this));

        return;
    }

    this.origin = origin;
    this.originOptions = options;
};

StateModifier.prototype.setAlign = function setAlign(align, options, callback) {
    while (align.length < 3) align.push(null);

    if (this.node) {
        _setComponentValue(this._alignComp, align, options, callback);
    }
    else if (options) {
        this._onLoadCallbacks.push((function() {
            this.align = align;
            this.alignOptions = options;
            _setComponentValue(this._alignComp, align, options, callback);
        }).bind(this));

        return;
    }

    this.align = align;
    this.alignOptions = options;
};

StateModifier.prototype.setSize = Surface.prototype.setSize;

StateModifier.prototype.setProportions = function setProportions(proportions) {
    this.proportions = proportions;
    if (!this.node) return;

    this.node.setProportionalSize.apply(this.node, proportions);
};

StateModifier.prototype.setNode = function setNode(node) {
    this._setNode(node);
    this.el = new DOMElement(node, {});

    var i;
    for (i = 0; i < this._queue.length; i++) {
        this._queue[i].setNode(this.node.addChild());
    }

    this._positionComp = new Position(node);
    this._rotationComp = new Rotation(node);
    this._scaleComp = new Scale(node);
    this._alignComp = new Align(node);
    this._originComp = new Origin(node);
    this._mountPointComp = new MountPoint(node);
    this._sizeComp = new Size(node);
    this._opacityComp = new Opacity(node);

    if (this.size) this.setSize(this.size);
    if (this.origin) this.setOrigin(this.origin);
    if (this.align) this.setAlign(this.align);
    if (this.opacity !== null) this.setOpacity(this.opacity);
    if (this.transform) this.setTransform(this.transform);
    if (this.proportions) this.setProportions(this.proportions);

    for (i = 0; i < this._onLoadCallbacks.length; i++) {
        this._onLoadCallbacks[i]();
    }
};

StateModifier.prototype.getSizedNode = function getSizedNode() {
    return this.node;
};

module.exports = StateModifier;
