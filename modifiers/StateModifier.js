// @author Taehoon Moon 2015

'use strict';

var DOMElement = require('famous/dom-renderables/DOMElement');
var Align = require('famous/components/Align');
var Origin = require('famous/components/Origin');
var MountPoint = require('famous/components/MountPoint');
var Size = require('famous/components/Size');
var Opacity = require('famous/components/Opacity');
var Transitionable = require('famous/transitions/Transitionable');

var Surface = require('../core/Surface');
var View = require('../core/View');
var Transform = require('../core/Transform');

function StateModifier(options) {
    View.apply(this, arguments);

    this._compId = null;
    this._onLoadCallbacks = [];
    this._transDict = {};
    this._onTransition = false;

    this.transform = options.transform ? options.transform : Transform.identity;
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.origin = options.origin ? options.origin : [0, 0, 0];
    this.align = options.align ? options.align : [0, 0, 0];
    this.size = options.size ? options.size : null;
    this.proportions = options.proportions ? options.proportions : null;

    this.opacityOptions = null;
    this.originOptions = null;
    this.alignOptions = null;
    this.sizeOptions = null;
    this.proportionsOptions = null;

    this._alignComp = null;
    this._originComp = null;
    this._mountPointComp = null;
    this._sizeComp = null;
    this._opacityComp = null;
}

StateModifier.prototype = Object.create(View.prototype);
StateModifier.prototype.constructor = StateModifier;

/*
 * enum
 * Currently it only uses Transform...
 */
StateModifier.Type = {
    TRANSFORM: 1
};

function _setComponentValue(component, value, options, callback) {
    component.set.apply(component, value.concat(options).concat(callback));
}

StateModifier.prototype.setTransform = function setTransform(transform, options, callback) {
    var transitionable = new Transitionable(this.transform.getValue());

    var position = transform.getPosition();
    var rotation = transform.getRotation();
    var scale = transform.getScale();

    function run() {
        transitionable.set(transform.getValue(), options);
        this._transDict[StateModifier.Type.TRANSFORM] = [transitionable, callback];
        if (!this._onTransition)
            this.node.requestUpdate(this._compId);
    }

    if (this.node) {
        if (options)
            run.call(this);
        else {
            this.node.setPosition.apply(this.node, position);
            this.node.setRotation.apply(this.node, rotation);
            this.node.setScale.apply(this.node, scale);
        }
    }
    else if (options) {
        this._onLoadCallbacks.push(run.bind(this));
        return;
    }

    this.transform = transform;
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

StateModifier.prototype._setTransform = function _setTransform(time, transitionable) {
    var value = transitionable.get(time);
    this.node.setPosition.apply(this.node, value.position);
    this.node.setRotation.apply(this.node, value.rotation);
    this.node.setScale.apply(this.node, value.scale);
};

StateModifier.prototype.setNode = function setNode(node) {
    this._setNode(node);
    this.node.el = new DOMElement(node, {});

    this._compId = this.node.addComponent({
        onUpdate: (function(time) {
            var item = this._transDict[StateModifier.Type.TRANSFORM];
            if (!item) return;

            var transitionable = item[0];
            var callback = item[1];

            this._setTransform(time, transitionable);
            this._onTransition = transitionable.isActive();

            if (this._onTransition)
                node.requestUpdateOnNextTick(this._compId);
            else {
                delete this._transDict[StateModifier.Type.TRANSFORM];
                if (callback) callback();
            }
        }).bind(this)
    });

    var i;
    for (i = 0; i < this._queue.length; i++) {
        this._queue[i].setNode(this.node.addChild());
    }

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
