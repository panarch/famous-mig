// @author Taehoon Moon 2015

'use strict';

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
var Timer = require('../utilities/Timer');

function StateModifier(options) {
    this.node = null;
    this._queue = [];

    this.transform = null;
    this.opacity = null;
    this.origin = null;
    this.align = null;
    this.size = null;
    this.proportions = null;

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

    if (options) {
        if (options.transform) this.setTransform(options.transform);
        if (options.opacity !== null) this.setOpacity(options.opacity);
        if (options.origin) this.setOrigin(options.origin);
        if (options.align) this.setAlign(options.align);
        if (options.size) this.setSize(options.size);
        if (options.proportions) this.setProportions(options.proportions);
    }
}

function _setComponentValue(component, value, options) {
    component.set.apply(component, value.concat(options));
}

StateModifier.prototype.setTransform = function setTransform(transform, options) {
    var position = transform.getPosition();
    var rotation = transform.getRotation();
    var scale = transform.getScale();

    while (position && position.length < 3) position.push(null);
    while (rotation && rotation.length < 3) rotation.push(null);
    while (scale && scale.length < 3) scale.push(null);

    if (this.node) {
        if (position) _setComponentValue(this._positionComp, position, options);
        if (rotation) _setComponentValue(this._rotationComp, rotation, options);
        if (scale) _setComponentValue(this._scaleComp, scale, options);
    }
    else if (options) {
        Timer.after((function() {
            this.transform = transform;
            this.transformOptions = options;
            if (position) _setComponentValue(this._positionComp, position, options);
            if (rotation) _setComponentValue(this._rotationComp, rotation, options);
            if (scale) _setComponentValue(this._scaleComp, scale, options);
        }).bind(this), 1);

        return;
    }

    this.transform = transform;
    this.transformOptions = options;
};

StateModifier.prototype.setOpacity = function setOpacity(opacity, options) {
    if (this.node) {
        this._opacityComp.set(opacity, options);
    }
    else if (options) {
        Timer.after((function() {
            this.opacity = opacity;
            this.opacityOptions = options;
            this._opacityComp.set(opacity, options);
        }).bind(this), 1);

        return;
    }

    this.opacity = opacity;
    this.opacityOptions = options;
};

StateModifier.prototype.setOrigin = function setOrigin(origin, options) {
    while (origin.length < 3) origin.push(null);

    if (this.node) {
        _setComponentValue(this._originComp, origin, options);
        _setComponentValue(this._mountPointComp, origin, options);
    }
    else if (options) {
        Timer.after((function() {
            this.origin = origin;
            this.originOptions = options;
            _setComponentValue(this._originComp, origin, options);
            _setComponentValue(this._mountPointComp, origin, options);
        }).bind(this), 1);

        return;
    }

    this.origin = origin;
    this.originOptions = options;
};

StateModifier.prototype.setAlign = function setAlign(align, options) {
    while (align.length < 3) align.push(null);

    if (this.node) {
        _setComponentValue(this._alignComp, align, options);
    }
    else if (options) {
        Timer.after((function() {
            this.align = align;
            this.alignOptions = options;
            _setComponentValue(this._alignComp, align, options);
        }).bind(this), 1);

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

StateModifier.prototype.add = View.prototype.add;
StateModifier.prototype._setNode = View.prototype._setNode;

StateModifier.prototype.setNode = function setNode(node) {
    this._setNode(node);

    for (var i = 0; i < this._queue.length; i++) {
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
    if (this.origin) this.setOrigin(this.origin, this.originOptions);
    if (this.align) this.setAlign(this.align, this.alignOptions);
    if (this.opacity !== null) this.setOpacity(this.opacity, this.opacityOptions);
    if (this.transform) this.setTransform(this.transform, this.transformOptions);
    if (this.proportions) this.setProportions(this.proportions);
};

module.exports = StateModifier;
